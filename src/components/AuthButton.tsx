"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export function AuthButton({ className }: { className?: string }) {
    const { auth, loading } = useContext(AuthContext)

    return (
        <Button
            onClick={auth}
            disabled={loading}
            className={className}
        >
            Continue with Schoology
        </Button>
    )
}