import { Role } from "@/constants/type";
import type { RoleType } from "@/types/jwt.types";

/**
 * Định nghĩa các nhóm quyền và đường dẫn tương ứng
 */
export const ROLE_PERMISSIONS = {
    [Role.Admin]: {
        name: "Quản trị viên",
        description: "Có toàn quyền truy cập hệ thống",
        allowedPaths: ["/manage/**", "/dashboard/**", "/courses/**"],
        restrictedPaths: [],
    },
    [Role.User]: {
        name: "Người dùng",
        description: "Truy cập hạn chế vào hệ thống",
        allowedPaths: [
            "/dashboard/**",
            "/courses/**",
            "/manage/calendar",
            "/manage/attendance-tracking",
            "/manage/attendance-history",
            "/manage/projects/my-projects",
            "/profile/**",
        ],
        restrictedPaths: [
            "/manage/users",
            "/manage/roles",
            "/manage/permissions",
            "/manage/configs",
            "/manage/logging",
            "/manage/areas",
            "/manage/devices",
            "/manage/dashboard",
            "/manage/projects/project-list",
        ],
    },
} as const;

/**
 * Đường dẫn công khai không cần đăng nhập
 */
export const PUBLIC_PATHS = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/about",
    "/contact",
] as const;

/**
 * Đường dẫn chỉ dành cho admin
 */
export const ADMIN_ONLY_PATHS = [
    "/manage/users",
    "/manage/roles",
    "/manage/permissions",
    "/manage/configs",
    "/manage/logging",
    "/manage/areas",
    "/manage/devices",
    "/admin",
] as const;

/**
 * Đường dẫn dành cho user thường
 */
export const USER_PATHS = ["/dashboard", "/courses", "/profile"] as const;

/**
 * Kiểm tra xem một đường dẫn có khớp với pattern không
 */
function matchPath(path: string, pattern: string): boolean {
    // Nếu pattern kết thúc bằng /**, thì cũng cho phép match exact path
    // VD: /courses/** sẽ match cả /courses và /courses/something
    if (pattern.endsWith("/**")) {
        const basePath = pattern.slice(0, -3); // Remove /**
        // Kiểm tra exact match với base path
        if (path === basePath) {
            return true;
        }
        // Kiểm tra match với sub paths
        if (path.startsWith(basePath + "/")) {
            return true;
        }
        return false;
    }

    // Chuyển đổi pattern thành regex cho các trường hợp khác
    const regexPattern = pattern
        .replace(/\*\*/g, ".*") // ** khớp với mọi thứ
        .replace(/\*/g, "[^/]*") // * khớp với segment đơn
        .replace(/\//g, "\\/"); // escape /

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
}

/**
 * Lấy trang chủ mặc định dựa trên role
 */
export function getDefaultHomePage(userRole: RoleType): string {
    switch (userRole) {
        case Role.Admin:
            return "/manage/roles";
        case Role.User:
            return "/dashboard";
        default:
            return "/dashboard";
    }
}

/**
 * Kiểm tra xem user có quyền truy cập đường dẫn không
 */
export function hasPermission(userRole: RoleType, path: string): boolean {
    // Kiểm tra đường dẫn công khai
    if (PUBLIC_PATHS.some((publicPath) => matchPath(path, publicPath))) {
        return true;
    }

    const rolePermission = ROLE_PERMISSIONS[userRole];
    if (!rolePermission) return false;

    // Luôn cho phép truy cập trang home mặc định của role đó
    const homePage = getDefaultHomePage(userRole);
    if (path === homePage) {
        return true;
    }

    // Kiểm tra đường dẫn bị hạn chế
    const isRestricted = rolePermission.restrictedPaths.some((restrictedPath) =>
        matchPath(path, restrictedPath)
    );
    if (isRestricted) return false;

    // Kiểm tra đường dẫn được phép
    const isAllowed = rolePermission.allowedPaths.some((allowedPath) =>
        matchPath(path, allowedPath)
    );

    return isAllowed;
}

/**
 * Kiểm tra xem user có phải admin không
 */
export function isAdmin(userRole: RoleType): boolean {
    return userRole === Role.Admin;
}

/**
 * Kiểm tra xem user có phải user thường không
 */
export function isUser(userRole: RoleType): boolean {
    return userRole === Role.User;
}

/**
 * Lấy danh sách route được phép cho role
 */
export function getAllowedRoutes(userRole: RoleType): readonly string[] {
    const rolePermission = ROLE_PERMISSIONS[userRole];
    return rolePermission ? rolePermission.allowedPaths : [];
}

/**
 * Kiểm tra đường dẫn có phải route công khai không
 */
export function isPublicPath(path: string): boolean {
    return PUBLIC_PATHS.some((publicPath) => matchPath(path, publicPath));
}

/**
 * Kiểm tra đường dẫn có phải route auth không (login, register)
 */
export function isAuthPath(path: string): boolean {
    const authPaths = ["/login", "/register", "/forgot-password"];
    return authPaths.some((authPath) => matchPath(path, authPath));
}
