"use client"

import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"

export function Auth() {
    const { refresh } = useContext(UserContext)
    const [token, setToken] = useState<string | null>()

    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/auth`)
        ws.onmessage = ({ data }) => {
            if (data !== "auth")
                return setToken(data)
            ws.close()
            refresh()
            new BroadcastChannel("auth").postMessage("")
        }
    }, [refresh])

    function auth() {
        if (!token) return
        window.open(
            `https://pausd.schoology.com/oauth/authorize?oauth_token=${token}&oauth_callback=${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
            "_blank",
            `popup, noreferrer, width=480, height=697, left=${(screen.width - 480) / 2} top=${(screen.height - 697) / 2}`
        )
    }

    return (
        <Button onClick={auth} disabled={!token}>
            Continue with Schoology
        </Button>
    )
}