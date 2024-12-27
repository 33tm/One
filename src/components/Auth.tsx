"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

export function Auth({ className, variant="default" }: { className?: string, variant?: Variant }) {
    const { auth, loading } = useContext(AuthContext)

    return (
        <Button
            onClick={auth}
            disabled={loading}
            className={`transition-all duration-200 ${className}`}
            variant={variant}
        >
            Continue with Schoology
        </Button>
    )
}