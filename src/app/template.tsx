"use client"

import { usePathname } from "next/navigation"
import { motion } from "motion/react"

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()
    return (
        // <AnimatePresence>
        <motion.div
            key={pathname}
        // exit={{ opacity: 0 }}
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        >
            {children}
        </motion.div>
        // </AnimatePresence>
    )
}