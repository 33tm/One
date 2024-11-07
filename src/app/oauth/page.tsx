import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function OAuth({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
    const { token } = await searchParams
    const { ["x-forwarded-for"]: ip } = Object.fromEntries(await headers())

    if (!token)
        return redirect("/")

    if (ip.startsWith("199.80."))
        return redirect(url("https://pausd.schoology.com"))

    function url(domain: string) {
        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?domain=${encodeURIComponent(domain)}`,
        })
        return `${domain}/oauth/authorize?${params}`
    }

    return (
        <div className="h-screen">
            <Link href={url("https://pausd.schoology.com")}>
                <div className="bg-white h-1/2">
                    asd
                </div>
            </Link>
            <div className="bg-amber-800 h-1/2">
                adsasd
            </div>
        </div>
    )
}