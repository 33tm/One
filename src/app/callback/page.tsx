"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export default function Callback() {
    const params = useSearchParams()
    const [error, setError] = useState<string>()

    const key = params.get("oauth_token")
    const domain = params.get("domain")

    useEffect(() => {
        if (!key || !domain) return
        new BroadcastChannel("auth").onmessage = () => window.close()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
            method: "POST",
            body: JSON.stringify({ key, domain }),
            credentials: "include"
        }).then(async res => res.status !== 200 && setError(await res.text()))
    }, [key, domain])

    return error ? <Error>An error occurred during authentication.</Error> : <Loader />
}