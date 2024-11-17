"use client"

import server from "@/server"

import { useEffect, useState } from "react"

import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export function Callback({ oauth_token, domain }: { oauth_token: string, domain: string }) {
    const [error, setError] = useState<string>()

    console.log(oauth_token, domain)
    useEffect(() => {
        if (!oauth_token || !domain) return
        new BroadcastChannel("auth").onmessage = () => window.close()
        server("/auth/callback", {
            method: "POST",
            body: JSON.stringify({ key: oauth_token, domain }),
            credentials: "include"
        }).then(async res => res.status !== 200 && setError(await res.text()))
    }, [oauth_token, domain])

    return error ? <Error>An error occurred during authentication.</Error> : <Loader />
}