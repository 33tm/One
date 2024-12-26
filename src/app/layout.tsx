import type { Metadata } from "next"

import { ThemeProvider } from "@/contexts/ThemeContext"

import Background from "@/components/Background"

import "@/app/globals.css"

export const metadata: Metadata = {
    title: "One",
    description: "Schoology Grade Calculator",
    referrer: "no-referrer"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <Background>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </Background>
        </html>
    )
}