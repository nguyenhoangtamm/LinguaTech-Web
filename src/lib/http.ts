import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import https from "https";

type CustomOptions = AxiosRequestConfig & {
    baseUrl?: string | undefined;
};

const agent = new https.Agent({ rejectUnauthorized: false });
const ENTITY_ERROR_STATUS = 500;
const ENTITY_ERROR_NOT_FOUNT_STATUS = 400;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class HttpError extends Error {
    status: number;
    payload: {
        message: string;
        [key: string]: any;
    };

    constructor({
        status,
        payload,
        message = "Lỗi hãy kiểm tra lại",
    }: {
        status: number;
        payload: any;
        message?: string;
    }) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

export class EntityError extends HttpError {
    status: 422;
    payload: EntityErrorPayload;

    constructor({
        status,
        payload,
    }: {
        status: 422;
        payload: EntityErrorPayload;
    }) {
        super({ status, payload, message: payload.message });
        this.status = status;
        this.payload = payload;
    }
}

let clientLogoutRequest: null | Promise<any> = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const isClient = () => typeof window !== "undefined";

const axiosInstance = axios.create({
    timeout: 600000,
});

const request = async <Response>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options?: CustomOptions | undefined
) => {
    const baseUrl =
        options?.baseUrl === undefined
            ? envConfig.NEXT_PUBLIC_API_ENDPOINT
            : options.baseUrl;
    const fullUrl = `${baseUrl}/${normalizePath(url)}`;
    const baseHeaders: { [key: string]: string } = {
        "Content-Type":
            options?.data instanceof FormData
                ? "multipart/form-data"
                : "application/json",
    };

    if (isClient()) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            baseHeaders.Authorization = `Bearer ${accessToken}`;
        }
        const profileCode = localStorage.getItem("x-profile-code");
        if (profileCode) {
            baseHeaders["x-profile-code"] = profileCode;
        }
    }

    try {
        const response: AxiosResponse<Response> = await axiosInstance({
            method,
            url: fullUrl,
            data: options?.data,
            headers: {
                ...baseHeaders,
                ...options?.headers,
            },
            ...options,
            httpsAgent: agent,
        });

        if (isClient()) {
            const normalizeUrl = normalizePath(url);
            if (normalizeUrl === "api/auth/login") {
                const {
                    data: { accessToken, refreshToken },
                } = response.data as LoginResType;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
            } else if (normalizeUrl === "api/auth/logout") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("x-profile-code");
            }
        }
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{
            message: string;
            errors?: any;
        }>;
        const data = {
            status: axiosError.response?.status || 500,
            payload: axiosError.response?.data || {
                message: "Lỗi không xác định",
            },
        };

        if (!axiosError.response) {
            throw new HttpError({
                status: 500,
                payload: { message: "Network Error" },
            });
        }

        if (axiosError.response.status === ENTITY_ERROR_STATUS) {
            throw new EntityError({
                status: 422,
                payload: data.payload as EntityErrorPayload,
            });
        } else if (
            axiosError.response.status === ENTITY_ERROR_NOT_FOUNT_STATUS
        ) {
            const mappedErrors: EntityErrorPayload = {
                message: data.payload.message,
                errors: Object.keys(data.payload.errors).flatMap((field) =>
                    data.payload.errors[field].map((msg: any) => ({
                        field: field || "unknownField",
                        message: msg,
                    }))
                ),
            };
            throw new EntityError({
                status: 422,
                payload: mappedErrors,
            });
        } else if (axiosError.response.status === AUTHENTICATION_ERROR_STATUS) {
            if (isClient()) {
                const originalRequest = axiosError.config;

                if (!isRefreshing) {
                    isRefreshing = true;
                    const refreshToken = localStorage.getItem("refreshToken");

                    if (refreshToken) {
                        try {
                            const response = await axiosInstance.post(
                                "/api/auth/refresh-token",
                                {
                                    refreshToken,
                                }
                            );

                            const {
                                data: {
                                    accessToken,
                                    refreshToken: newRefreshToken,
                                },
                            } = response.data;

                            // Cập nhật tokens trong localStorage
                            localStorage.setItem("accessToken", accessToken);
                            localStorage.setItem(
                                "refreshToken",
                                newRefreshToken
                            );

                            // Cập nhật header cho request ban đầu
                            if (originalRequest && originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            }

                            processQueue(null, accessToken);
                            isRefreshing = false;

                            // Retry request ban đầu với token mới
                            if (originalRequest) {
                                return axiosInstance(originalRequest as any);
                            }
                        } catch (refreshError) {
                            processQueue(refreshError, null);
                            isRefreshing = false;

                            // Refresh token cũng hết hạn, logout user
                            if (!clientLogoutRequest) {
                                clientLogoutRequest = axiosInstance.post(
                                    "/api/auth/logout",
                                    {
                                        refreshToken,
                                    }
                                );
                                try {
                                    await clientLogoutRequest;
                                } catch (error) {
                                } finally {
                                    localStorage.removeItem("accessToken");
                                    localStorage.removeItem("refreshToken");
                                    clientLogoutRequest = null;
                                    location.href = "/login";
                                }
                            }
                            throw refreshError;
                        }
                    } else {
                        // Không có refresh token, logout ngay
                        isRefreshing = false;
                        if (!clientLogoutRequest) {
                            clientLogoutRequest = axiosInstance.post(
                                "/api/auth/logout",
                                null,
                                {
                                    headers: baseHeaders,
                                }
                            );
                            try {
                                await clientLogoutRequest;
                            } catch (error) {
                            } finally {
                                localStorage.removeItem("accessToken");
                                clientLogoutRequest = null;
                                location.href = "/login";
                            }
                        }
                    }
                } else {
                    // Đang trong quá trình refresh, thêm vào queue
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            if (originalRequest && originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return originalRequest
                                ? axiosInstance(originalRequest as any)
                                : Promise.reject("No original request");
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
            } else {
                const accessToken = (
                    options?.headers as any
                )?.Authorization?.split("Bearer ")[1];
                redirect(`/logout?accessToken=${accessToken}`);
            }
        } else {
            throw new HttpError(data);
        }
    }
};

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, "data">) {
        return request<Response>("GET", url, options);
    },
    post<Response>(
        url: string,
        data: any,
        options?: Omit<CustomOptions, "data">
    ) {
        return request<Response>("POST", url, { ...options, data });
    },
    put<Response>(
        url: string,
        data: any,
        options?: Omit<CustomOptions, "data">
    ) {
        return request<Response>("PUT", url, { ...options, data });
    },
    delete<Response>(url: string, options?: Omit<CustomOptions, "data">) {
        return request<Response>("DELETE", url, options);
    },
};

export default http;
