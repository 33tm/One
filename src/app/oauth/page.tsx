import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { OAuth } from "@/app/oauth"

export default async ({ searchParams }: { searchParams: Promise<Record<string, string>> }) => {
    const { token } = await searchParams
    const {
        ["x-forwarded-for"]: ip,
        ["x-forwarded-host"]: origin
    } = Object.fromEntries(await headers())

    if (!token) return redirect("/")

    // PAUSD CIDR: 199.80.192.0/18
    const pausd = !!ip.match(/^199\.80\.(?:19[2-9]|2[0-4][0-9]|25[0-5])\.(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])$/)

    return (
        <OAuth
            token={token}
            origin={origin}
            pausd={pausd}
        />
    )
}