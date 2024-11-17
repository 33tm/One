import { redirect } from "next/navigation"

import { Callback } from "@/app/callback"

export default async ({ searchParams }: { searchParams: Promise<Record<string, string>> }) => {
    const { oauth_token, domain } = await searchParams

    if (!oauth_token || !domain)
        return redirect("/")

    return <Callback oauth_token={oauth_token} domain={domain} />
}