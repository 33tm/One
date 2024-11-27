"use client"

import { createContext, useEffect, useState } from "react"

const themes = [
    {
        name: "Default",
        background: "#171717",
        primary: "#FAFAFA",
        secondary: "#A3A3A3",
        tertiary: "#262626"
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
    }
]

export const ThemeContext = createContext<typeof themes[0]>(themes[0])

export const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [theme, setTheme] = useState(themes[0])

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
        <ThemeContext.Provider value={theme}>
            <button onClick={(() => setTheme(themes[themes.findIndex(t => t.name === theme.name) + 1] || themes[0]))} className="z-50 absolute bottom-2 text-background bg-primary">rotate theme</button>
            {children}
        </ThemeContext.Provider >
    )
}