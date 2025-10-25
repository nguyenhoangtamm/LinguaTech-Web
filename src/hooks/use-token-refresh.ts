import { useCallback, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "@/types/jwt.types";
import { convertRoleIdToRole } from "@/utils/role-converter";
import { useAppContext } from "@/components/app-provider";

const REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh trước 5 phút

export const useTokenRefresh = () => {
    const { setIsAuth, setUser, setUserRole, setUserId } = useAppContext();
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isRefreshingRef = useRef(false);
    const scheduleTokenRefreshRef = useRef<((token: string) => void) | null>(
        null
    );

    const refreshToken = useCallback(async () => {
        // Tránh refresh lại khi đang refresh
        if (isRefreshingRef.current) return;

        isRefreshingRef.current = true;

        try {
            const refreshTokenStr = localStorage.getItem("refreshToken");

            if (!refreshTokenStr) {
                // Không có refresh token, logout user
                localStorage.removeItem("accessToken");
                setIsAuth(false);
                setUser(null);
                setUserRole(null);
                setUserId(null);
                return;
            }

            const response = await fetch("/api/auth/refresh-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken: refreshTokenStr }),
            });

            const data = await response.json();

            if (response.ok && data.data) {
                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = data.data;

                // Lưu token mới
                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Cập nhật context
                const decoded = jwtDecode<TokenPayload>(newAccessToken);
                setUser(decoded);
                const role = convertRoleIdToRole(decoded.RoleId);
                setUserRole(role);
                setUserId(decoded.userId);
                setIsAuth(true);

                // Lên lịch refresh tiếp theo
                if (scheduleTokenRefreshRef.current) {
                    scheduleTokenRefreshRef.current(newAccessToken);
                }
            } else {
                // Refresh thất bại, logout user
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setIsAuth(false);
                setUser(null);
                setUserRole(null);
                setUserId(null);
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            // Refresh thất bại, logout user
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuth(false);
            setUser(null);
            setUserRole(null);
            setUserId(null);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [setIsAuth, setUser, setUserRole, setUserId]);

    const scheduleTokenRefresh = useCallback(
        (accessToken: string) => {
            try {
                const decoded = jwtDecode<TokenPayload>(accessToken);
                const currentTime = Math.floor(Date.now() / 1000);
                const expiryTime = decoded.exp * 1000; // Convert to milliseconds
                const now = Date.now();
                const timeUntilExpiry = expiryTime - now;

                // Nếu token sắp hết hạn (dưới 5 phút), refresh ngay
                if (timeUntilExpiry < REFRESH_THRESHOLD) {
                    refreshToken();
                } else {
                    // Lên lịch refresh trước 5 phút khi sắp hết hạn
                    const refreshTime = timeUntilExpiry - REFRESH_THRESHOLD;

                    // Clear timeout cũ nếu có
                    if (refreshTimeoutRef.current) {
                        clearTimeout(refreshTimeoutRef.current);
                    }

                    refreshTimeoutRef.current = setTimeout(() => {
                        refreshToken();
                    }, refreshTime);
                }
            } catch (error) {
                console.error("Error scheduling token refresh:", error);
            }
        },
        [refreshToken]
    );

    // Update ref when function changes
    useEffect(() => {
        scheduleTokenRefreshRef.current = scheduleTokenRefresh;
    }, [scheduleTokenRefresh]);

    const startTokenRefreshCycle = useCallback(
        (token: string) => {
            scheduleTokenRefresh(token);
        },
        [scheduleTokenRefresh]
    );

    const stopTokenRefreshCycle = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
            refreshTimeoutRef.current = null;
        }
        isRefreshingRef.current = false;
    }, []);

    useEffect(() => {
        return () => {
            stopTokenRefreshCycle();
        };
    }, [stopTokenRefreshCycle]);

    return {
        startTokenRefreshCycle,
        stopTokenRefreshCycle,
        refreshToken,
    };
};
