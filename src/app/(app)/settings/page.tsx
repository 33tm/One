"use client"

import { useContext, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import server from "@/server"
import { redirect } from "@/server/redirect"

import { AuthContext } from "@/contexts/AuthContext"

import Palette from "@/components/Palette"
import { Separator } from "@/components/ui/separator"

import { CircleHelp, LaptopMinimal, Loader, LogOut, Smartphone } from "lucide-react"
import { CgSpinner } from "react-icons/cg"
import { DateTime } from "luxon"

interface Session {
    ip: string
    ua: string
    latest: string
    created: string
    index: number
}

interface Sessions {
    current: Omit<Session, "index">
    sessions: Session[]
}

function platform(ua: string) {
    if (/android|iphone|ipad/i.test(ua)) return "mobile"
    if (/macintosh|windows|linux/i.test(ua)) return "desktop"
    return "unknown"
}

function model(ua: string) {
    if (/android/i.test(ua)) return "Android"
    if (/iphone/i.test(ua)) return "iPhone"
    if (/ipad/i.test(ua)) return "iPad"
    if (/macintosh/i.test(ua)) return "Mac"
    if (/windows/i.test(ua)) return "Windows"
    if (/linux/i.test(ua)) return "Linux"
    return "Unknown"
}

function Icon({ ua, className }: { ua: string, className?: string }) {
    if (ua === "mobile") return <Smartphone className={className} />
    if (ua === "desktop") return <LaptopMinimal className={className} />
    if (ua === "unknown") return <CircleHelp className={className} />
}

export default function Settings() {
    const { user, loading } = useContext(AuthContext)
    const [sessions, setSessions] = useState<Sessions>()

    useEffect(() => {
        if (loading || (!loading && !user)) return
        server("/sessions", { method: "POST" })
            .then(res => res.json())
            .then(setSessions)
    }, [loading, user])

    if (loading) return <Loader />

    if (!user) return redirect("/")

    return (
        <>
            <div className="flex h-full overflow-y-auto py-10">
                <div className="mx-auto space-y-3">
                    <div className="p-4 bg-tertiary rounded-lg">
                        <p className="text-xl font-bold">Color Palette</p>
                        <p className="text-sm">colors yahoo</p>
                        <Separator className="bg-secondary rounded-full my-2" />
                        <Palette />
                    </div>
                    <div className="p-4 bg-tertiary rounded-lg">
                        <p className="text-xl font-bold">Active Sessions</p>
                        <p className="text-sm">Non-redundant setting woahh</p>
                        <Separator className="bg-secondary rounded-full my-2" />
                        <AnimatePresence>
                            {sessions ? (
                                <div className="space-y-2">
                                    <div className="flex px-4 py-3 bg-primary text-background rounded-lg">
                                        <Icon
                                            ua={platform(sessions.current.ua)}
                                            className="w-6 h-6 mr-3 my-auto text-tertiary"
                                        />
                                        <p className="my-auto font-bold">This Device</p>
                                    </div>
                                    {sessions.sessions
                                        .sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime())
                                        .map(session => (
                                            <div
                                                key={session.index}
                                                className="flex max-w-[284px] justify-between px-4 py-3 bg-background text-primary rounded-lg"
                                            >
                                                <div className="flex space-x-4">
                                                    <Icon
                                                        ua={platform(session.ua)}
                                                        className="w-6 h-6 my-auto"
                                                    />
                                                    <div className="-space-y-0.5">
                                                        <p className="my-auto font-bold">
                                                            {model(session.ua)}
                                                        </p>
                                                        <div className="text-xs">
                                                            <p className="w-40 truncate font-bold text-secondary">
                                                                {session.ip}
                                                            </p>
                                                            <p>Last Seen <strong>{DateTime.fromISO(session.latest).toRelative()}</strong></p>
                                                            <p>Created <strong>{DateTime.fromISO(session.created).toFormat("yyyy.L.d")}</strong></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                    className="h-fit p-2 my-auto bg-primary text-background rounded-lg"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <CgSpinner className="animate-spin h-8 w-8 mx-auto my-8" />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}