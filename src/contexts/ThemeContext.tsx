"use client"

import { createContext, useEffect, useState } from "react"

const themes = [
    {
        name: "Default",
        background: "#171717",
        primary: "#FAFAFA",
        secondary: "#A3A3A3",
        tirtiary: "#262626"
    },
    {
        name: "Green",
        background: "#E1F0DA",
        primary: "#4F6F52",
        secondary: "#6A946E",
        tirtiary: "#B4CAB6"
    },
    {
        name: "Blue",
        background: "#DDE6ED",
        primary: "#526D82",
        secondary: "#6D8BA3",
        tirtiary: "#B6C5D1"
    },
    {
        name: "Beige",
        background: "#F3EEEA",
        primary: "#594545",
        secondary: "#816464",
        tirtiary: "#C2B0b0"
    }
]

export const ThemeContext = createContext<typeof themes[0]>(themes[0])

export const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [theme, setTheme] = useState(themes[0])

    useEffect(() => {
        for (const [variable, value] of Object.entries(theme).slice(1))
            document.documentElement.style.setProperty(`--${variable}`, value)
    }, [theme])

    return (
        <ThemeContext.Provider value={theme}>
            {children}
            <button onClick={(() => setTheme(themes[themes.indexOf(theme) + 1] || themes[0]))} className="text-background bg-primary">rotate theme</button>
        </ThemeContext.Provider>
    )
}