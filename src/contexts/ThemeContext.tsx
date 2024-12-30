"use client"

import { useFavicon } from "@/hooks/useFavicon"
import { createContext, useEffect, useState } from "react"

interface Theme {
    name: string
    background: string
    primary: string
    secondary: string
    tertiary: string
}

const themes = [
    {
        name: "Dark",
        background: "#171717",
        primary: "#FAFAFA",
        secondary: "#999999",
        tertiary: "#262626"
    },
    {
        name: "Light",
        background: "#F2F2F2",
        primary: "#3A3A3A",
        secondary: "#6E6E6E",
        tertiary: "#BFBFBF"
    },
    {
        name: "Green",
        background: "#E1F0DA",
        primary: "#4F6F52",
        secondary: "#6A946E",
        tertiary: "#B4CAB6"
    },
    {
        name: "Blue",
        background: "#DDE6ED",
        primary: "#526D82",
        secondary: "#6D8BA3",
        tertiary: "#B6C5D1"
    },
    {
        name: "Beige",
        background: "#F3EEEA",
        primary: "#594545",
        secondary: "#756464",
        tertiary: "#C0B0B0"
    },
    {
        name: "Mint",
        background: "#EAF9F3",
        primary: "#4D8076",
        secondary: "#79A69A",
        tertiary: "#CDE5DC"
    },
    {
        name: "Lavender",
        background: "#F6F0FA",
        primary: "#6A5B8E",
        secondary: "#9C88B2",
        tertiary: "#D8C8E3"
    },
    {
        name: "Pink",
        background: "#FFF0F3",
        primary: "#9E4F64",
        secondary: "#C9798F",
        tertiary: "#EBD0D8"
    }
] satisfies Theme[]

interface ThemeContextType {
    theme: Theme
    themes: Theme[]
    setTheme: (theme: Theme) => void
}

const defaultThemeContext = {
    theme: themes[0],
    themes,
    setTheme: () => { }
} satisfies ThemeContextType

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [theme, setTheme] = useState<Theme>(themes[4])
    const favicon = useFavicon()

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if (!theme) return

        try {
            setTheme(JSON.parse(theme))
        } catch {
            localStorage.removeItem("theme")
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme))

        for (const [variable, value] of Object.entries(theme).slice(1))
            document.documentElement.style.setProperty(`--${variable}`, value)

        if (!favicon) return

        const canvas = document.createElement("canvas")
        canvas.width = 64
        canvas.height = 64

        const context = canvas.getContext("2d")
        if (!context) return

        context.fillStyle = theme.background
        context.beginPath()
        context.arc(32, 32, 32, 0, 2 * Math.PI)
        context.closePath()
        context.fill()

        context.fillStyle = theme.primary
        context.beginPath()
        context.arc(32, 32, 18, 0, 2 * Math.PI)
        context.closePath()
        context.fill()

        context.fillStyle = theme.background
        context.beginPath()
        context.arc(32, 32, 12, 0, 2 * Math.PI)
        context.closePath()
        context.fill()

        const url = canvas.toDataURL()
        favicon.href = url
        localStorage.setItem("favicon", url)
    }, [theme, favicon])

    return (
        <ThemeContext.Provider value={{ theme, themes, setTheme }}>
            <meta name="theme-color" content={theme.primary} />
            {children}
        </ThemeContext.Provider >
    )
}