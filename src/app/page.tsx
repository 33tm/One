"use client"

import Link from "next/link"
import { motion } from "motion/react"

import Palette from "@/components/Palette"
import { Button } from "@/components/ui/button"

import { ArrowRight, Circle } from "lucide-react"

export default function Page() {
    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
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
                    <Palette />
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="flex mt-8"
                    >
                        <Link href="/grades" prefetch className="mx-auto">
                            <Button className="flex items-center transition-colors duration-500">
                                <p>Continue</p>
                                <ArrowRight className="mx-auto" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}