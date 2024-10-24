"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { CgSpinner } from "react-icons/cg"

export default function Callback() {
    const key = useSearchParams().get("oauth_token")

    useEffect(() => {
        if (!key) return
        new BroadcastChannel("auth").onmessage = () => window.close()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
            method: "POST",
            body: JSON.stringify({ key }),
            credentials: "include"
        })
    }, [key])

    return (
        <div className="flex h-screen">
            <CgSpinner className="m-auto text-4xl animate-spin" />
        </div>
    )
}