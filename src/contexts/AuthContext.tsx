"use client"

import server, { websocket } from "@/server"

import { createContext, useCallback, useEffect, useRef, useState } from "react"

import Error from "@/components/Error"

export interface Section {
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
    domain: string
    sections: Section[]
    created: string
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
    const popup = useRef<Window | null>(null)

    const refresh = useCallback(() => {
        server("/auth/verify", { method: "POST" })
            .then(async res => {
                if (res.ok) {
                    setUser(await res.json())
                    setToken(null)
                    popup.current?.close()
                    popup.current = null
                } else {
                    setUser(null)
                    if (token) return
                    const ws = websocket("/auth")
                    ws.onmessage = ({ data }) => {
                        if (data === "auth") ws.close()
                        else setToken(data)
                    }
                }
            })
            .catch(() => setError(true))
    }, [token])

    useEffect(() => {
        refresh()
        new BroadcastChannel("auth").onmessage = refresh
    }, [refresh])

    function auth() {
        if (!token) return
        if (popup.current && !popup.current.closed)
            return popup.current.focus()
        popup.current = window.open(
            `/oauth?token=${token}`,
            "_blank",
            `popup, width=480, height=697, left=${(screen.width - 480) / 2} top=${(screen.height - 697) / 2}`
        )
    }

    function logout() {
        user?.sections.forEach(section => localStorage.removeItem(`grades-${section.id}`))
        server("/auth/logout", { method: "POST" })
            .then(refresh)
            .catch(() => setError(true))
    }

    const loading = !token && !user

    return (
        <AuthContext.Provider value={{ user, loading, auth, refresh, logout }}>
            {error ? <Error>Server offline!</Error> : children}
        </AuthContext.Provider>
    )
}