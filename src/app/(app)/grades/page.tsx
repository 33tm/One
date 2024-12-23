"use client"

import Link from "next/link"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { ThemeContext } from "@/contexts/ThemeContext"

import { Auth } from "@/components/Auth"

export default function Grades() {
    const { user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)

    // Using an image breaks on WebKit
    // Yippee wahoo one more context needed
    const background = theme.background
        .match(/#(.{2})(.{2})(.{2})/)!
        .map(c => parseInt(c, 16))
        .filter(c => !isNaN(c))
        .join(", ")

    return (
        <>
            <title>
                Grades | One
            </title>
            {user ? (
                <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                    <div className="m-4 md:m-8 md:mt-1 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
                        {user?.sections.map((section) => (
                            <Link key={section.id} href={`/grades/${section.id}`}>
                                <div
                                    className="relative group text-center text-lg py-8 rounded-xl hover:scale-105 hover:shadow-2xl transition ease-out duration-200"
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(${background}, 0.8), rgba(${background}, 0.8)), url('${section.image}')`,
                                        backgroundSize: "cover"
                                    }}
                                >
                                    <p className="font-bold truncate px-8">{section.name}</p>
                                    <p className="truncate px-8">{section.section}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex fixed top-0 -z-10 w-screen h-dvh outline-dashed">
                    <div className="text-xl font-bold">
                        <h1 className="font-bold text-xl">Grades</h1>
                        <Auth variant="link" className="text-md underline hover:opacity-75" />
                    </div>
                    <div className="m-auto">
                    </div>
                </div>
            )}
        </>
    )
}