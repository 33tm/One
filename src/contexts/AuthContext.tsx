"use client"

import { createContext, useEffect, useState } from "react"

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

    function auth() {
        if (!token) return
        window.open(
            `https://pausd.schoology.com/oauth/authorize?oauth_token=${token}&oauth_callback=${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
            "_blank",
            `popup, noreferrer, width=480, height=697, left=${(screen.width - 480) / 2} top=${(screen.height - 697) / 2}`
        )
    }

    function refresh() {
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
        })
    }

    function logout() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        }).then(refresh)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(refresh, [])

    const loading = !token

    return (
        <AuthContext.Provider value={{ user, loading, auth, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    )
}