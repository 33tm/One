import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SearchProvider } from "@/contexts/SearchContext"

import "@/app/globals.css"

export const metadata: Metadata = {
    title: "Gunn One",
    referrer: "no-referrer"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans text-foreground bg-background transition-colors duration-200`}>
                <AuthProvider>
                    <ThemeProvider>
                        <SearchProvider>
                            {children}
                        </SearchProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}