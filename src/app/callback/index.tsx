"use client"

import server from "@/server"

import { useEffect, useState } from "react"

import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export function Callback({ key, domain }: { key: string, domain: string }) {
    const [error, setError] = useState<string>()

    useEffect(() => {
        if (!key || !domain) return
        server("/auth/callback", {
            method: "POST",
            body: JSON.stringify({ key: key, domain }),
            credentials: "include"
        }).then(async res => res.status !== 200 && setError(await res.text()))
    }, [key, domain])

    return error ? <Error>An error occurred during authentication.</Error> : <Loader />
}