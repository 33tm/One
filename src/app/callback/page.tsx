"use client"

import server from "@/server"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export default function Callback() {
    const {
        oauth_token: key,
        domain
    } = Object.fromEntries(useSearchParams())
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (!key || !domain) return
        new BroadcastChannel("auth").onmessage = () => window.close()
        server("/auth/callback", {
            method: "POST",
            body: JSON.stringify({ key, domain }),
            credentials: "include"
        }).then(async res => res.status !== 200 && setError(await res.text()))
    }, [key, domain])

    return error ? <Error>An error occurred during authentication.</Error> : <Loader />
}