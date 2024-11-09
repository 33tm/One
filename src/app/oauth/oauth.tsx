"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { search, type School } from "@/server/search"
import { redirect } from "@/server/redirect"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Circle } from "lucide-react"

export function OAuth({ token }: { token: string }) {
    const [query, setQuery] = useState("")
    const [schools, setSchools] = useState<School[]>()
    const [school, setSchool] = useState<School | null>(null)
    const [redirecting, setRedirecting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (query.length < 3)
            return setSchools(undefined)
        setLoading(true)
        const timeout = setTimeout(() => {
            search(query)
                .then(setSchools)
                .then(() => setLoading(false))
        }, 200)
        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        if (!schools?.find(s => s.id === school?.id))
            setSchool(null)
    }, [schools])

    function oauth(domain: string) {
        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?domain=${encodeURIComponent(`https://${domain}`)}`
        })
        return `https://${domain}/oauth/authorize?${params}`
    }

    return (
        <div className="overflow-hidden">
            <div className={`absolute w-screen transition-opacity duration-200 opacity-0 ${open && "opacity-100"}`}>
                {open && (
                    <div className="flex p-4">
                        <Button
                            variant="secondary"
                            className="rounded-r-none"
                            onClick={() => open && setOpen(false)}
                        >
                            <ChevronLeft />
                        </Button>
                        <Input
                            autoFocus
                            className="text-lg rounded-none"
                            placeholder="Search"
                            defaultValue={query}
                            onChange={({ target }) => setQuery(target.value)}
                        />
                        <Button
                            className="rounded-l-none"
                            disabled={!school || loading || redirecting}
                            onClick={() => {
                                setRedirecting(true)
                                redirect(oauth(school?.domain || "app.schoology.com"))
                            }}
                        >
                            Open
                        </Button>
                    </div>
                )}
                <div className="h-auto px-4 pb-4 space-y-2 overflow-y-auto overflow-x-hidden select-none">
                    {schools && schools[0] && schools[0].title !== "No Schools Found" ? (
                        schools.filter(({ id }) => id !== 2573996462).map(s => (
                            <div
                                key={s.id + s.title}
                                className={`p-3 rounded-lg font-bold hover:scale-[101.5%] hover:shadow-2xl hover:cursor-pointer transition duration-200 ${((s.id === school?.id || s.location === school?.location) && (s.domain === school?.domain && s.domain !== "app.schoology.com")) ? "bg-primary text-tirtiary" : "bg-tirtiary"}`}
                                onClick={() => setSchool(s)}
                            >
                                <p className="text-xl truncate">{s.title}</p>
                                <p className="text-secondary truncate">{s.location}</p>
                                <p className="text-secondary truncate">{s.domain || "app.schoology.com"}</p>
                            </div>
                        ))
                    ) : (
                        query.length < 3 ? (
                            <></>
                        ) : loading ? (
                            "Loading..."
                        ) : (
                            "No Schools"
                        )
                    )}
                </div>
            </div>
            <div className={`flex h-[50dvh] transition-transform duration-500 ${open && "-translate-y-full"}`}>
                <Circle strokeWidth={4} size={32} className="m-auto" />
            </div>
            <div className={`h-[50dvh] transition-transform duration-500 ${open && "translate-y-full"}`}>
                <div className="absolute bottom-0 w-screen">
                    <div
                        className="flex h-[22dvh] bg-tirtiary text-lg font-semibold rounded-t-2xl hover:cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <p className="m-auto">
                            Find My School
                        </p>
                    </div>
                    <div className={`flex flex-col bg-tirtiary h-[6dvh]`}>
                        <div className={`flex justify-between h-[100px] bg-background rounded-t-2xl`}>
                            <Separator className="my-auto w-[40vw]" />
                            <p className="my-auto text-secondary font-bold">OR</p>
                            <Separator className="my-auto w-[40vw]" />
                        </div>
                    </div>
                    <Link
                        href={oauth("pausd.schoology.com")}
                        className="flex h-[22dvh] bg-primary text-lg font-bold text-tirtiary rounded-t-2xl"
                        prefetch
                    >
                        <p className="m-auto">
                            PAUSD Login
                        </p>
                    </Link>
                </div>
            </div>
        </div >
    )
}