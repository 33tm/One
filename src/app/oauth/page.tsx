"use client"

import { ip } from "@/server/ip"

import { useSearchParams } from "next/navigation"

import { useEffect } from "react"

export default function OAuth() {
    const token = useSearchParams().get("token")!

    if (!token || document.referrer !== `${document.location.origin}/communities`)
        return window.location.replace("/")

    function redirect(domain: string) {
        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?domain=${encodeURIComponent(domain)}`,
        })
        window.open(`${domain}/oauth/authorize?${params}`, "_self", "noreferrer")
    }

    useEffect(() => { ip().then(ip => ip?.startsWith("199.80.") && redirect("https://pausd.schoology.com")) }, [])

    return (
        <div className="h-screen">
            <div className="bg-white h-1/2">
                asd
            </div>
            <div className="bg-amber-800 h-1/2">
                adsasd
            </div>
        </div>
    )
}