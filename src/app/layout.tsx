import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { ThemeProvider } from "@/contexts/ThemeContext"

import Background from "@/components/Background"

import "@/app/globals.css"

export const metadata: Metadata = {
    title: "One",
    description: "Schoology Grade Calculator",
    referrer: "no-referrer"
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <Analytics />
            <SpeedInsights />
            <Background>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </Background>
        </html>
    )
}