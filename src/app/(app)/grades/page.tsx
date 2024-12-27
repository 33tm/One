"use client"

import Link from "next/link"

import { useContext } from "react"
import { AnimatePresence, motion } from "motion/react"

import { AuthContext } from "@/contexts/AuthContext"
import { ThemeContext } from "@/contexts/ThemeContext"

import { Auth } from "@/components/Auth"

export default function Grades() {
    const { user, loading } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)

    // Using an image breaks on WebKit
    // Yippee wahoo one more context needed
    const background = theme.background
        .match(/#(.{2})(.{2})(.{2})/)!
        .map(c => parseInt(c, 16))
        .filter(c => !isNaN(c))
        .join(", ")

    if (loading) return <></>

    return (
        <>
            <title>
                Grades | One
            </title>
            {user ? (
                <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                    <div className="m-4 md:m-24 md:mt-12 grid md:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-3">
                        <AnimatePresence>
                            {user?.sections.map((section, i) => (
                                <Link key={section.id} href={`/grades/${section.id}`} prefetch>
                                    <motion.button
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                        whileTap={{
                                            scale: 0.9,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                        initial={{
                                            y: 25,
                                            opacity: 0
                                        }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            transition: { type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 }
                                        }}
                                        className="relative w-full group text-center text-lg py-8 rounded-xl hover:shadow-2xl transition-shadow ease-in-out duration-200"
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(${background}, 0.7), rgba(${background}, 0.7)), url('${section.image}')`,
                                            backgroundSize: "cover"
                                        }}
                                    >
                                        <p className="font-bold truncate px-8">{section.name}</p>
                                        <p className="truncate px-8">{section.section}</p>
                                    </motion.button>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </div>
                </div >
            ) : (
                <div className="flex fixed top-0 -z-10 w-screen h-dvh outline-dashed">
                    <div className="text-xl font-bold">
                        <h1 className="font-bold text-xl">Grades</h1>
                        <Auth variant="link" className="text-md underline hover:opacity-75" />
                    </div>
                    <div className="m-auto">
                    </div>
                </div>
            )
            }
        </>
    )
}