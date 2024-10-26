"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import { TriangleAlert } from "lucide-react"

interface Section {
    id: string
    name: string
    period: number
    teacher: string
    image: string
}

export interface UserType {
    id: number
    name: string
    class: number
    sections: Section[]
}

interface AuthContextType {
    user: UserType | null
    loading: boolean
    auth: () => void
    refresh: () => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    auth: () => { },
    refresh: () => { },
    logout: () => { }
})

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<UserType | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState(false)

    const refresh = useCallback(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (res.ok) {
                setUser(await res.json())
                setToken(null)
            } else {
                setUser(null)
                if (token) return
                const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/auth`)
                ws.onmessage = ({ data }) => {
                    if (data !== "auth")
                        return setToken(data)
                    ws.close()
                    refresh()
                    new BroadcastChannel("auth").postMessage(null)
                }
            }
        }).catch(() => setError(true))
    }, [token])

    useEffect(refresh, [refresh])

    function auth() {
        if (!token) return
        window.open(
            `https://pausd.schoology.com/oauth/authorize?oauth_token=${token}&oauth_callback=${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
            "_blank",
            `popup, noreferrer, width=480, height=697, left=${(screen.width - 480) / 2} top=${(screen.height - 697) / 2}`
        )
    }

    function logout() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        }).then(refresh).catch(() => setError(true))
    }

    const loading = !token

    return (
        <AuthContext.Provider value={{ user, loading, auth, refresh, logout }}>
            {error ? (
                <div className="flex h-screen">
                    <div className="m-auto space-y-4 text-muted-foreground">
                        <TriangleAlert size={32} className="m-auto" />
                        <p>Server is offline!</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}