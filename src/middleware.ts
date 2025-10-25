import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes } from "@/config/routes";
import {
    hasPermission,
    isPublicPath,
    isAuthPath,
    getDefaultHomePage,
} from "@/utils/permissions";
import { convertRoleIdToRole } from "@/utils/role-converter";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "@/types/jwt.types";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    // Kiểm tra nếu là đường dẫn công khai
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Nếu không có token và cần đăng nhập
    if (!accessToken) {
        // Nếu đang ở trang auth và không có token thì cho phép
        if (isAuthPath(pathname)) {
            return NextResponse.next();
        }
        // Redirect về trang login
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Nếu có token, decode để lấy thông tin user
    let userPayload: TokenPayload;
    try {
        userPayload = jwtDecode<TokenPayload>(accessToken);
    } catch (error) {
        // Token không hợp lệ, xóa cookie và redirect về login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        return response;
    }

    // Kiểm tra token đã hết hạn chưa
    const currentTime = Math.floor(Date.now() / 1000);
    if (userPayload.exp < currentTime) {
        // Token hết hạn, xóa cookie và redirect về login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        return response;
    }

    // Convert RoleId thành role string
    const userRole = convertRoleIdToRole(userPayload.RoleId);

    // Nếu đang ở trang auth và đã đăng nhập, redirect về trang chủ
    if (isAuthPath(pathname)) {
        const homePage = getDefaultHomePage(userRole);
        return NextResponse.redirect(new URL(homePage, request.url));
    }

    // Kiểm tra quyền truy cập
    if (!hasPermission(userRole, pathname)) {
        // Không có quyền, redirect về trang chủ phù hợp với role
        const homePage = getDefaultHomePage(userRole);
        return NextResponse.redirect(new URL(homePage, request.url));
    }

    // Nếu truy cập root path và đã đăng nhập, redirect về trang chủ phù hợp
    if (pathname === "/") {
        const homePage = getDefaultHomePage(userRole);
        return NextResponse.redirect(new URL(homePage, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public assets)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
