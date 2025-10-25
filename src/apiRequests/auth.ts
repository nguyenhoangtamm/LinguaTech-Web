import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
    SLogin: (body: LoginBodyType) =>
        http.post<LoginResType>("/auth/login", body, {
            baseUrl: "http://localhost:5013/api/v1",
        }),
    login: (body: LoginBodyType) =>
        http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
    register: (body: RegisterBodyType) =>
        http.post<RegisterResType>("/api/auth/register", body, { baseUrl: "" }),
    SRegister: (body: RegisterBodyType) =>
        http.post<RegisterResType>("/auth/register", body, {
            baseUrl: "http://localhost:5013/api/v1",
        }),
    logoutFromNextServerToServer: ({
        accessToken,
        refreshToken,
    }: {
        accessToken: string;
        refreshToken: string;
    }) =>
        http.post<MessageResType>(
            "/auth/logout",
            {
                refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ),
    logout: (
        body: {
            refreshToken: string;
        },
        signal?: AbortSignal | undefined
    ) =>
        http.post<MessageResType>("/api/auth/logout", body, {
            baseUrl: "",
            signal,
        }),
};

export default authApiRequest;
