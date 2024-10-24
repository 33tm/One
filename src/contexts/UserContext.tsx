"use client"

import { createContext, useEffect, useState } from "react"

interface User {
    id: number
    name: string
}

interface UserContextType {
    user: User | null
    refresh: () => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    refresh: () => { }
})

export const UserProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<User | null>(null)

    function refresh() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (!res.ok) setUser(null)
            else setUser(await res.json())
        })
    }

    useEffect(refresh, [])

    return (
        <UserContext.Provider value={{ user, refresh }}>
            {children}
        </UserContext.Provider>
    )
}