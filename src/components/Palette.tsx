import { usePathname } from "next/navigation"
import { useContext } from "react"
import { motion } from "motion/react"

import { ThemeContext } from "@/contexts/ThemeContext"

import { Circle } from "lucide-react"

export default function Palette() {
    const { themes, setTheme } = useContext(ThemeContext)
    const pathname = usePathname()
    const transition = pathname === "/"
    return (
        <div className={`grid grid-cols-4 gap-3 p-2 rounded-2xl bg-tertiary border-4 border-secondary ${transition && "transition-colors duration-500"}`}>
            {themes.map(theme => (
                <motion.button
                    key={theme.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.90 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onClick={() => setTheme(theme)}
                    className="flex rounded-md w-14 h-14 outline outline-4"
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
    )
}