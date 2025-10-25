"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload, RoleType } from "@/types/jwt.types";
import { Role } from "@/constants/type";
import { convertRoleIdToRole } from "@/utils/role-converter";
import {
    hasPermission,
    isAdmin,
    isUser,
    getDefaultHomePage,
} from "@/utils/permissions";

/**
 * Hook để quản lý trạng thái xác thực và quyền hạn của người dùng
 */
export function useAuth() {
    const [user, setUser] = useState<TokenPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<RoleType | null>(null);

    // Khôi phục trạng thái xác thực từ localStorage
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                // Kiểm tra token đã hết hạn chưa
                const currentTime = Math.floor(Date.now() / 1000);
                if (decoded.exp > currentTime) {
                    setUser(decoded);
                    // Convert RoleId thành role string
                    const role = convertRoleIdToRole(decoded.RoleId);
                    setUserRole(role);
                } else {
                    // Token hết hạn, xóa nó
                    localStorage.removeItem("accessToken");
                    setError("Token has expired");
                }
            } catch (err) {
                setError("Invalid token");
                localStorage.removeItem("accessToken");
            }
        }
        setIsLoading(false);
    }, []);

    /**
     * Đăng nhập - lưu token
     */
    const login = (token: string) => {
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            localStorage.setItem("accessToken", token);
            setUser(decoded);
            // Convert RoleId thành role string
            const role = convertRoleIdToRole(decoded.RoleId);
            setUserRole(role);
            setError(null);
        } catch (err) {
            setError("Failed to login");
            throw err;
        }
    };

    /**
     * Đăng xuất
     */
    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
        setUserRole(null);
        setError(null);
    };

    /**
     * Kiểm tra người dùng đã đăng nhập chưa
     */
    const isAuthenticated = user !== null;

    /**
     * Kiểm tra người dùng có phải admin không
     */
    const isUserAdmin = userRole ? isAdmin(userRole) : false;

    /**
     * Kiểm tra người dùng có phải user thường không
     */
    const isNormalUser = userRole ? isUser(userRole) : false;

    /**
     * Kiểm tra người dùng có quyền truy cập đường dẫn không
     */
    const canAccess = (path: string): boolean => {
        if (!userRole) return false;
        return hasPermission(userRole, path);
    };
    /**
     * Lấy trang chủ mặc định cho role hiện tại
     */
    const getHomePage = (): string => {
        if (!userRole) return "/login";
        return getDefaultHomePage(userRole);
    };

    /**
     * Lấy userId của người dùng
     */
    const userId = user?.userId;

    return {
        // State
        user,
        isLoading,
        error,
        isAuthenticated,
        userRole,
        userId,

        // Checks
        isUserAdmin,
        isNormalUser,
        canAccess,
        getHomePage,

        // Actions
        login,
        logout,
    };
}

/**
 * Hook để kiểm tra quyền hạn của người dùng
 */
export function usePermission() {
    const { user, userRole } = useAuth();

    /**
     * Kiểm tra người dùng có quyền truy cập đường dẫn không
     */
    const canAccess = (path: string): boolean => {
        if (!userRole) return false;
        return hasPermission(userRole, path);
    };

    /**
     * Kiểm tra người dùng có phải admin không
     */
    const isAdmin = (): boolean => {
        if (!userRole) return false;
        return userRole === Role.Admin;
    };

    /**
     * Kiểm tra người dùng có phải user thường không
     */
    const isUser = (): boolean => {
        if (!userRole) return false;
        return userRole === Role.User;
    };

    /**
     * Lấy role của người dùng
     */
    const getRole = (): RoleType | null => {
        return userRole;
    };

    return {
        canAccess,
        isAdmin,
        isUser,
        getRole,
    };
}
