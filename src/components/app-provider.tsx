'use client'
import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";
import { jwtDecode } from 'jwt-decode'
import type { TokenPayload, RoleType } from '@/types/jwt.types'
import { convertRoleIdToRole } from '@/utils/role-converter'
import { useTokenRefresh } from '@/hooks/use-token-refresh'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
})

interface AppContextType {
    isAuth: boolean
    setIsAuth: (value: boolean) => void
    userRole: RoleType | null
    setUserRole: (value: RoleType | null) => void
    userId: number | null
    setUserId: (value: number | null) => void
    user: TokenPayload | null
    setUser: (value: TokenPayload | null) => void
}

const AppContext = createContext<AppContextType>({
    isAuth: false,
    setIsAuth: (value: boolean) => { },
    userRole: null,
    setUserRole: (value: RoleType | null) => { },
    userId: null,
    setUserId: (value: number | null) => { },
    user: null,
    setUser: (value: TokenPayload | null) => { },
})

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context
}

function Provider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false)
    const [userRole, setUserRole] = useState<RoleType | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [user, setUser] = useState<TokenPayload | null>(null)
    const [hasProfileCode, setHasProfileCode] = useState<boolean>(true);

    const { startTokenRefreshCycle, stopTokenRefreshCycle } = useTokenRefresh();

    useUserProfileMeQuery({
        enabled: isAuth
    })

    useLayoutEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken) {
            try {
                const decoded = jwtDecode<TokenPayload>(accessToken)
                // Kiểm tra token đã hết hạn chưa
                const currentTime = Math.floor(Date.now() / 1000)
                const timeUntilExpiry = decoded.exp - currentTime

                if (timeUntilExpiry > 0) {
                    setIsAuth(true)
                    setUser(decoded)
                    // Convert RoleId thành role string
                    const role = convertRoleIdToRole(decoded.RoleId)
                    setUserRole(role)
                    setUserId(decoded.userId)

                    // Bắt đầu chu kỳ auto refresh token
                    startTokenRefreshCycle(accessToken)
                } else if (refreshToken) {
                    // Token hết hạn nhưng có refresh token, thử refresh
                    fetch('/api/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refreshToken })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.data) {
                                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data
                                localStorage.setItem('accessToken', newAccessToken)
                                localStorage.setItem('refreshToken', newRefreshToken)

                                const newDecoded = jwtDecode<TokenPayload>(newAccessToken)
                                setIsAuth(true)
                                setUser(newDecoded)
                                const role = convertRoleIdToRole(newDecoded.RoleId)
                                setUserRole(role)
                                setUserId(newDecoded.userId)
                            } else {
                                // Refresh failed, clear tokens
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('refreshToken')
                                setIsAuth(false)
                                setUser(null)
                                setUserRole(null)
                                setUserId(null)
                            }
                        })
                        .catch(() => {
                            // Refresh failed, clear tokens
                            localStorage.removeItem('accessToken')
                            localStorage.removeItem('refreshToken')
                            setIsAuth(false)
                            setUser(null)
                            setUserRole(null)
                            setUserId(null)
                        })
                } else {
                    // Token hết hạn và không có refresh token, xóa nó
                    localStorage.removeItem('accessToken')
                    setIsAuth(false)
                    setUser(null)
                    setUserRole(null)
                    setUserId(null)
                }
            } catch (error) {
                // Token không hợp lệ
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                setIsAuth(false)
                setUser(null)
                setUserRole(null)
                setUserId(null)
            }
        }
    }, [startTokenRefreshCycle])

    return (
        <AppContext.Provider
            value={{
                isAuth,
                setIsAuth,
                userRole,
                setUserRole,
                userId,
                setUserId,
                user,
                setUser
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>{children}</Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
