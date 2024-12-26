"use client"

import Link from "next/link"
import { useContext } from "react"
import { motion } from "motion/react"

import { ThemeContext } from "@/contexts/ThemeContext"

import { ArrowRight, Circle } from "lucide-react"

export default function Page() {
    const { setTheme, themes } = useContext(ThemeContext)

    return (
        <motion.div
            // initial={{ y: 30, opacity: 0 }}
            // animate={{ y: 0, opacity: 1 }}
            // transition={{ type: "spring", stiffness: 100 }}
            className="grid grid-cols-1 md:grid-cols-2 w-screen h-dvh"
        >
            <div className="mx-auto mt-auto md:m-auto text-center">
                <p className="font-mono text-secondary transition-colors duration-500">Welcome to</p>
                <div className="flex text-4xl space-x-2">
                    <p className="font-bold">One</p>
                    <p className="font-light font-mono text-secondary transition-colors duration-500">/</p>
                    <Circle
                        strokeWidth={4}
                        size={28}
                        className="h-full my-auto text-secondary transition-colors duration-500"
                    />
                </div>
            </div>
            <div className="flex flex-col m-auto text-center">
                <div className="m-auto">
                    <p className="font-semibold font-mono mb-2">
                        Select a color theme:
                    </p>
                    <div className="grid grid-cols-4 gap-3 p-2 rounded-2xl bg-tertiary border-4 border-secondary transition-colors duration-500">
                        {themes.map(theme => (
                            <motion.button
                                key={theme.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.90 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="flex rounded-md w-14 h-14 outline outline-4"
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
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.75 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mt-8"
                    >
                        <Link href="/grades">
                            <ArrowRight className="mx-auto" />
                        </Link>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}