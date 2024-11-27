import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            <div className="-z-20 h-[calc(100dvh-72px)] w-screen">
                {children}
            </div>
            <Toaster />
        </>
    )
}