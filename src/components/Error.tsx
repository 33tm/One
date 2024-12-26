import { motion } from "motion/react"
import { TriangleAlert } from "lucide-react"

export default function Error({ children, title }: Readonly<{ children: React.ReactNode, title?: string }>) {
    return (
        <>
            {title && <title>{title}</title>}
            <motion.div
                className="fixed flex flex-col top-0 h-dvh w-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="m-auto space-y-4 text-center text-secondary">
                    <TriangleAlert size={32} className="m-auto" />
                    <div>{children}</div>
                </div>
            </motion.div >
        </>
    )
}