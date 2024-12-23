"use client"

import Link from "next/link"
import { useContext } from "react"

import { ThemeContext } from "@/contexts/ThemeContext"

import { ArrowRight, Circle } from "lucide-react"

export default function Page() {
    const { setTheme, themes } = useContext(ThemeContext)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 w-screen h-dvh">
            <div className="mx-auto mt-auto md:m-auto text-center select-none">
                <p className="font-mono text-secondary">Welcome to</p>
                <div className="flex text-4xl space-x-2">
                    <p className="font-bold">One</p>
                    <p className="font-light font-mono text-secondary">/</p>
                    <Circle
                        strokeWidth={4}
                        size={28}
                        className="h-full my-auto text-secondary"
                    />
                </div>
            </div>
            <div className="flex flex-col m-auto text-center">
                <div className="m-auto">
                    <p className="select-none font-semibold font-mono mb-2">
                        Select a color theme:
                    </p>
                    <div className="grid grid-cols-4 gap-3 p-2 rounded-md bg-tertiary outline outline-4 outline-secondary">
                        {themes.map(theme => (
                            <div
                                key={theme.name}
                                className="flex rounded-md w-14 h-14 outline outline-4 hover:cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() => setTheme(theme)}
                                style={{
                                    backgroundColor: theme.background,
                                    color: theme.primary,
                                    outlineColor: theme.secondary
                                }}
                            >
                                <Circle
                                    className="m-auto"
                                    strokeWidth={4}
                                    size={32}
                                    stroke={theme.primary}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="hover:pointer hover:animate-pulse transform translate-y-8">
                        <Link href="/grades">
                            <ArrowRight className="mx-auto" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}