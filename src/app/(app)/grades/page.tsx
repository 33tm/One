"use client"

import Link from "next/link"

import { useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { AuthContext } from "@/contexts/AuthContext"
import { ThemeContext } from "@/contexts/ThemeContext"

import { Auth } from "@/components/Auth"
import Loader from "@/components/Loader"

import { Circle } from "lucide-react"

export default function Grades() {
    const { user, loading } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)

    const video = useRef<HTMLVideoElement>(null)
    const [play, setPlay] = useState(false)

    useEffect(() => {
        if (user) return

        function showcase() {
            setTimeout(() => {
                if (!video.current) return
                setPlay(true)
                setTimeout(() => {
                    video.current?.play()
                    setTimeout(() => {
                        setPlay(false)
                        setTimeout(() => {
                            if (!video.current) return
                            video.current.src = "https://cdn.tttm.us/one/visualize.mp4"
                            setTimeout(() => {
                                setPlay(true)
                                video.current?.play()
                                setTimeout(() => {
                                    setPlay(false)
                                    setTimeout(() => {
                                        if (!video.current) return
                                        video.current.src = "https://cdn.tttm.us/one/calculate.mp4"
                                        showcase()
                                    }, 300)
                                }, 8500)
                            }, 700)
                        }, 300)
                    }, 7500)
                }, 300)
            }, 1000)
        }

        showcase()
    }, [user])

    // Using an image breaks on WebKit
    // Yippee wahoo one more context needed
    const background = theme.background
        .match(/#(.{2})(.{2})(.{2})/)!
        .map(c => parseInt(c, 16))
        .filter(c => !isNaN(c))
        .join(", ")

    if (loading) return <Loader />

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
                                            backgroundImage: `linear-gradient(rgba(${background}, 0.75), rgba(${background}, 0.75)), url('${section.image}')`,
                                            backgroundSize: "cover"
                                        }}
                                    >
                                        <p className="font-extrabold truncate px-8">{section.name}</p>
                                        <p className="font-bold text-secondary truncate px-8">{section.section}</p>
                                    </motion.button>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </div>
                </div >
            ) : (
                <div className="flex flex-col md:flex-row h-full overflow-y-hidden">
                    <div className="flex w-full md:w-1/2 h-20 my-8 md:my-0 md:h-full">
                        <div className="m-auto text-center md:text-left space-y-2 px-4">
                            <h1 className="md:text-xl font-light">Schoology Grade Calculator and Visualizer</h1>
                            <Auth variant="outline" className="text-xs h-8 p-4" />
                        </div>
                    </div>
                    <div className="flex pb-28 md:p-16 w-full md:w-1/2 h-[calc(100%-80px)] md:h-full ">
                        <motion.div
                            className="m-auto shadow-2xl h-full"
                            initial={{
                                y: 250,
                                opacity: 0
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { type: "spring", stiffness: 220, damping: 20 }
                            }}
                        >
                            <div className="relative mx-auto h-full aspect-[9/19.5] outline outline-4 rounded-md">
                                <div className="flex bg-tertiary w-full h-full">
                                    <Circle
                                        className="m-auto"
                                        size={30}
                                        strokeWidth={4}
                                    />
                                </div>
                                <video
                                    ref={video}
                                    className={`absolute top-0 h-full w-full outline outline-4 rounded-md ${play || "opacity-0"} transition-opacity duration-300`}
                                    src="https://cdn.tttm.us/one/calculate.mp4"
                                    preload="auto"
                                    muted
                                    playsInline
                                    autoPlay
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </>
    )
}