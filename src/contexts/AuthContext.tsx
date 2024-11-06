"use client"

import { createContext, useEffect, useState } from "react"
import { Error } from "@/components/Error"

interface Section {
    id: string
    name: string
    section: string
    period: number
    teacher: string
    school: string
    image: string
}

export interface UserType {
    id: number
    name: string
    gunn: boolean
    pausd: boolean
    class: number | null
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
                const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws")}/auth`)
                ws.onmessage = ({ data }) => {
                    if (data !== "auth")
                        return setToken(data)
                    ws.close()
                    refresh()
                    new BroadcastChannel("auth").postMessage(null)
                }
            }
        }).catch(() => setError(true))
    }

    useEffect(refresh, [])

    function auth() {
        if (!token) return
        window.open(
            `/oauth?token=${token}`,
            "_blank",
            `popup, width=480, height=697, left=${(screen.width - 480) / 2} top=${(screen.height - 697) / 2}`
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
            {error ? <Error>Server is offline!</Error> : children}
        </AuthContext.Provider>
    )
}