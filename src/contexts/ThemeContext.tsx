"use client"

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
        secondary: "#A3A3A3",
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
        secondary: "#816464",
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
    themes: Theme[]
    theme: Theme
    setTheme: (theme: Theme) => void
}

const defaultThemeContext = {
    themes,
    theme: themes[0],
    setTheme: () => { }
} satisfies ThemeContextType

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [theme, setTheme] = useState<Theme>(themes[0])

    useEffect(() => {
        const raw = localStorage.getItem("theme")
        if (!raw) return
        try {
            setTheme(JSON.parse(raw))
        } catch {
            localStorage.removeItem("theme")
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme))
        for (const [variable, value] of Object.entries(theme).slice(1))
            document.documentElement.style.setProperty(`--${variable}`, value)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ themes, theme, setTheme }}>
            {children}
        </ThemeContext.Provider >
    )
}