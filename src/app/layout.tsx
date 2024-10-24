import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { UserProvider } from "@/contexts/UserContext"
import { SearchProvider } from "@/contexts/SearchContext"

import "@/app/globals.css"

export const metadata: Metadata = {
    title: "Gunn One"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans text-foreground bg-background`}>
                <UserProvider>
                    <SearchProvider>
                        {children}
                    </SearchProvider>
                </UserProvider>
            </body>
        </html>
    )
}