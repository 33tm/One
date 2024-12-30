"use client"

import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Background({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    const animate = pathname === "/"

    useEffect(() => {
        if ("serviceWorker" in navigator)
            navigator.serviceWorker.register("/sw.js")
    }, [])

    return (
        <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans select-none text-foreground bg-background ${animate && "transition-colors duration-500"}`}>
            {children}
        </body>
    )
}