import type { Metadata } from "next"

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

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "One",
                        url: "https://gunn.one/",
                        description: "Schoology Grade Calculator"
                    })
                }}
            />
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