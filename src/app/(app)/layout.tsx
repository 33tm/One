"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { toast } from "sonner"

import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname()

    useEffect(() => {
        toast.dismiss()
    }, [pathname])

    return (
        <>
            <Navbar />
            {children}
            <Toaster />
        </>
    )
}