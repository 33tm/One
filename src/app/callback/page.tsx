"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { CgSpinner } from "react-icons/cg"
import { TriangleAlert } from "lucide-react"

export default function Callback() {
    const [error, setError] = useState<string>()
    const key = useSearchParams().get("oauth_token")

    useEffect(() => {
        if (!key) return
        new BroadcastChannel("auth").onmessage = () => window.close()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
            method: "POST",
            body: JSON.stringify({ key }),
            credentials: "include"
        }).then(async res => res.status !== 200 && setError(await res.text()))
    }, [key])

    return (
        <div className="flex h-screen">
            {error ? (
                <div className="m-auto space-y-4 text-muted-foreground">
                    <TriangleAlert size={32} className="m-auto" />
                    <p>An error occurred during authentication.</p>
                </div>
            ) : (
                <CgSpinner className="m-auto text-4xl animate-spin" />
            )}
        </div>
    )
}