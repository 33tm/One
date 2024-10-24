"use client"

import { createContext, useEffect, useState } from "react"

export interface UserType {
    id: number
    name: string
}

export interface UserContextType {
    user: UserType | null
    refresh: () => void
    logout: () => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    refresh: () => { },
    logout: () => { }
})

export const UserProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<UserType | null>(null)

    function refresh() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (!res.ok) setUser(null)
            else setUser(await res.json())
        })
    }

    function logout() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        }).then(refresh)
    }

    useEffect(refresh, [])

    return (
        <UserContext.Provider value={{ user, refresh, logout }}>
            {children}
        </UserContext.Provider>
    )
}