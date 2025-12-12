import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "@/lib/http";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
    isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
    isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (value: string) =>
    isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
    isBrowser && localStorage.setItem("refreshToken", value);
export const removeTokensFromLocalStorage = () => {
    isBrowser && localStorage.removeItem("accessToken");
    isBrowser && localStorage.removeItem("refreshToken");
};

export const isTokenExpired = (token: string): boolean => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch {
        return true;
    }
};

export const isTokenExpiringSoon = (
    token: string,
    bufferMinutes = 5
): boolean => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const bufferTime = bufferMinutes * 60; // Convert minutes to seconds
        return payload.exp < currentTime + bufferTime;
    } catch {
        return true;
    }
};

export const handleErrorApi = ({
    error,
    setError,
    duration,
}: {
    error: any;
    setError?: UseFormSetError<any>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field.toLowerCase(), {
                type: "server",
                message: item.message,
            });
        });
    } else {
        toast({
            title: "Lỗi",
            description: error?.payload?.message ?? "Lỗi không xác định",
            variant: "destructive",
            duration: duration ?? 5000,
        });
    }
};

export const getDisplayedRowCount = (
    pageIndex: number,
    pageSize: number,
    currentPageRowCount: number,
    totalCount: number
): number => {
    if (pageIndex === 0) {
        return currentPageRowCount;
    }
    return totalCount > 0 ? pageIndex * pageSize + currentPageRowCount : 0;
};

export const buildUrlWithParams = (
    baseUrl: string,
    params: Record<string, any>
) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const getCurrentDateString = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
    const year = today.getFullYear();

    return `${day}${month}${year}`;
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
        Math.round((bytes / Math.pow(k, i)) * Math.pow(10, dm)) /
            Math.pow(10, dm) +
        " " +
        sizes[i]
    );
};

export const formatDate = (date: Date, locale: string = "en-US"): string => {
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
