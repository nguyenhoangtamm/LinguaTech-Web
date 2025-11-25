'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import type { RoleType } from '@/types/jwt.types'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: RoleType | RoleType[]
    fallback?: ReactNode
}

/**
 * Component bảo vệ route dựa trên quyền hạn của người dùng
 * 
 * @param children - Nội dung hiển thị nếu người dùng có quyền
 * @param requiredRole - Role cần thiết (nếu không có thì chỉ cần đã đăng nhập)
 * @param fallback - Nội dung hiển thị nếu không có quyền (loading component)
 */
export function ProtectedRoute({
    children,
    requiredRole,
    fallback,
}: ProtectedRouteProps) {
    const { isLoading, isAuthenticated, userRole, getHomePage } = useAuth()
    const router = useRouter()

    if (isLoading) {
        return fallback || <div>Loading...</div>
    }

    if (!isAuthenticated) {
        router.push('/login')
        return fallback || <div>Redirecting to login...</div>
    }

    // Nếu có yêu cầu role cụ thể
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        if (!userRole || !roles.includes(userRole)) {
            router.push(getHomePage())
            return fallback || <div>Access denied. Redirecting...</div>
        }
    }

    return <>{children}</>
}

/**
 * Component bảo vệ route chỉ cho admin
 */
export function AdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    const { isLoading, isUserAdmin, getHomePage } = useAuth()
    const router = useRouter()

    if (isLoading) {
        return fallback || <div>Loading...</div>
    }

    if (!isUserAdmin) {
        router.push(getHomePage())
        return fallback || <div>Access denied. Redirecting...</div>
    }

    return <>{children}</>
}

/**
 * Component bảo vệ route cho user thường
 */
export function UserRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    const { isLoading, isNormalUser, getHomePage } = useAuth()
    const router = useRouter()

    if (isLoading) {
        return fallback || <div>Loading...</div>
    }

    if (!isNormalUser) {
        router.push(getHomePage())
        return fallback || <div>Access denied. Redirecting...</div>
    }

    return <>{children}</>
}

/**
 * Component để render nội dung dựa trên role
 */
interface RoleBasedRenderProps {
    children: (role: RoleType | undefined) => ReactNode
    fallback?: ReactNode
}

export function RoleBasedRender({ children, fallback }: RoleBasedRenderProps) {
    const { isLoading, userRole } = useAuth()

    if (isLoading) {
        return fallback || <div>Loading...</div>
    }

    return <>{children(userRole??undefined)}</>
}
