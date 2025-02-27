"use client"

import server from "@/server"

import { useEffect, useState } from "react"

import Loader from "@/components/Loader"
import Error from "@/components/Error"

export function Callback({ oauth_token, domain }: { oauth_token: string, domain: string }) {
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (!oauth_token || !domain) return
        server("/auth/callback", {
            method: "POST",
            body: JSON.stringify({ key: oauth_token, domain })
        }).then(async res => {
            if (res.status !== 200) setError(await res.text())
            else new BroadcastChannel("auth").postMessage(null)
        })
    }, [oauth_token, domain])

    return error ? <Error>{error || "An error occured during authentication."}</Error> : <Loader />
}