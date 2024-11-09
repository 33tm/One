import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { OAuth } from "@/app/oauth/oauth"

export default async ({ searchParams }: { searchParams: Promise<Record<string, string>> }) => {
    const { token } = await searchParams
    const { ["x-forwarded-for"]: ip } = Object.fromEntries(await headers())

    if (!token)
        return redirect("/")

    // PAUSD CIDR: 199.80.192.0/18
    if (ip.match(/^199\.80\.(?:19[2-9]|2[0-4][0-9]|25[0-5])\.(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])$/)) {
        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?domain=${encodeURIComponent("https://pausd.schoology.com")}`
        })
        return redirect(`https://pausd.schoology.com/oauth/authorize?${params}`)
    }

    return <OAuth token={token} />
}