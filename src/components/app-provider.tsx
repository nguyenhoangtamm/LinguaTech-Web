'use client'
import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
})
const AppContext = createContext<{
    isAuth: boolean
    setIsAuth: (value: boolean) => void
}>({
    isAuth: false,
    setIsAuth: (value: boolean) => {}
})

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context
}

function Provider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false)
    const [hasProfileCode, setHasProfileCode] = useState<boolean>(true);
    useUserProfileMeQuery({
        enabled: isAuth
    })
    useLayoutEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        setIsAuth(Boolean(accessToken))
    }, [])
    return <AppContext.Provider value={{ isAuth, setIsAuth }}>{children}</AppContext.Provider>
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>{children}</Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
