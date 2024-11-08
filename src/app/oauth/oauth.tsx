"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { search, type School } from "@/server/search"
import { redirect } from "@/server/redirect"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function OAuth({ token }: { token: string }) {
    const [query, setQuery] = useState("")
    const [schools, setSchools] = useState<School[]>()
    const [school, setSchool] = useState<School | null>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (query.length < 3) return
        setSchool(null)
        search(query).then(setSchools)
    }, [query])

    function oauth(domain: string) {
        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?domain=${encodeURIComponent(`https://${domain}`)}`
        })
        return `https://${domain}/oauth/authorize?${params}`
    }

    return (
        <div className="h-screen">
            <div className="flex h-1/2">
                <Link href={oauth("pausd.schoology.com")}>
                    asdsdfjkdskakjl
                </Link>
                <Input
                    onChange={({ target }) => setQuery(target.value)}
                    onFocus={() => setOpen(true)}
                />
                <Button
                    disabled={!school}
                    onClick={() => redirect(oauth(school?.domain || "app.schoology.com"))}
                >
                    Open
                </Button>
            </div>
            <div className="h-1/2">
                <div className="h-full p-2 space-y-2 overflow-y-auto">
                    {schools && schools[0].title !== "No Schools Found" ? (
                        schools.filter(({ id }) => id !== 2573996462).map(s => {
                            const [city, state] = s.location.split(", ") || []
                            console.log(school?.domain)
                            return (
                                <div
                                    key={s.id + s.title}
                                    className={`flex p-2 rounded-lg hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition duration-200 ${((s.id === school?.id || s.location === school?.location) && (s.domain === school?.domain && s.domain !== "app.schoology.com")) ? "bg-primary text-tirtiary" : "bg-tirtiary"}`}
                                    onClick={() => setSchool(s)}
                                >
                                    <div className="font-bold">
                                        <p className="text-xl max-w-80 truncate">{s.title}</p>
                                        <p className="text-secondary">{s.domain || "app.schoology.com"}</p>
                                    </div>
                                    <div className="flex ml-auto text-secondary">
                                        <div className="my-auto">
                                            <p className="max-w-24 truncate text-right font-bold">{city}</p>
                                            <p className="max-w-24 truncate text-right">{state}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : "No schools found!"}
                </div>
            </div>
        </div >
    )
}