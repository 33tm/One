"use client"

import { useContext, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { DateTime } from "luxon"

import server from "@/server"

import { AuthContext } from "@/contexts/AuthContext"

import Loader from "@/components/Loader"
import Error from "@/components/Error"
import Palette from "@/components/Palette"
import { Separator } from "@/components/ui/separator"

import { CgSpinner } from "react-icons/cg"
import {
    CircleHelp,
    LaptopMinimal,
    LogOut,
    Smartphone
} from "lucide-react"
import { toast } from "sonner"

interface Session {
    hash: string
    ip: string
    ua: string
    platform: string
    model: string
    latest: string
    created: string
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
    if (/cros/i.test(ua)) return "ChromeOS"
    if (/windows/i.test(ua)) return "Windows"
    if (/linux/i.test(ua)) return "Linux"
    return "Unknown"
}

function parseSamsung(device: string) {
    if (!device) return device
    if (device.startsWith("SM-")) {
        // This is entirely useless why am I doing this
        const [, series, subseries, year, tier] = device.match(/SM-([A-Z])(\d)(\d)(\d)(.+)/) || []
        switch (series) {
            case "S": {
                let model = "Galaxy S2"

                model += parseInt(year) + 2
                model += subseries === "9" ? {
                    "1": "",
                    "6": "+",
                    "8": " Ultra"
                }[tier] : " FE"

                return model
            }
            case "F": {
                let model = "Galaxy "

                if (year === "0") {
                    model += {
                        "7": "Z Flip",
                        "9": "Fold"
                    }[subseries]

                    if (tier === "7")
                        model += " 5G"

                    return model
                }

                model += {
                    "1": "Z Flip ",
                    "6": "Z Fold "
                }[tier]

                model += parseInt(year) + 2

                return model
            }
            case "G": {
                let model = "Galaxy S"

                const generation = parseInt(year)
                // S5
                if (generation === 0)
                    model += 5
                // S6, S7
                else if (generation <= 3) {
                    model += generation + 4
                    model += {
                        "0": "",
                        "5": " Edge",
                        "8": " Edge+"
                    }[tier]
                }
                // S8, S9, S10
                else if (generation <= 7) {
                    model += generation + 3
                    model += {
                        "0": generation === 7 ? "e" : "",
                        "3": "",
                        "5": generation === 7 ? " Plus" : "+",
                        "7": " 5G"
                    }[tier]
                }
                // S20, S21
                else if (generation >= 8) {
                    model += generation + 12
                    model += {
                        "0": generation === 9 ? " FE" : "",
                        "1": "",
                        "6": "+",
                        "8": " Ultra"
                    }[tier]
                }

                return model
            }
            case "N": {
                let model = "Galaxy Note"

                const generation = parseInt(year)
                // Note Edge, Note 4, Note 5
                if (generation <= 2)
                    model += tier === "5" ? "Edge" : generation + 4
                // Note 7
                else if (generation <= 3)
                    model += tier === "5" ? "FE" : 7
                // Note 8, Note 9, Note 10
                else if (generation <= 7) {
                    model += generation + 3
                    model += {
                        "0": "",
                        "1": " 5G",
                        "5": "+",
                        "6": "+ 5G"
                    }[tier]
                }
                // Note 20
                else if (generation === 8) {
                    model += {
                        "0": "20",
                        "5": "20 Ultra"
                    }[tier]
                }

                return model
            }
            default: return device
        }
    }
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
        if (loading) return
        if (!user) {
            window.location.href = "/"
            return
        }
        server("/sessions", { method: "POST" })
            .then(res => res.json())
            .then(setSessions)
    }, [loading, user])

    if (loading) return <Loader />

    if (!user) return <Error><></></Error>

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
                                            <motion.div
                                                key={session.hash}
                                                className="flex max-w-[284px] justify-between px-4 py-3 bg-background text-primary rounded-lg"
                                                layout
                                            >
                                                <div className="flex space-x-4">
                                                    <Icon
                                                        ua={platform(session.ua)}
                                                        className="w-6 h-6 my-auto"
                                                    />
                                                    <div className="-space-y-0.5">
                                                        <p className="text-sm my-auto font-bold">
                                                            {parseSamsung(session.model) || model(session.ua)}
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
                                                    onClick={() => {
                                                        server("/sessions/delete", {
                                                            method: "POST",
                                                            body: JSON.stringify({ hash: session.hash })
                                                        }).then(async res => {
                                                            if (res.ok) {
                                                                toast.info("Session deleted")
                                                                setSessions(await res.json())
                                                            } else {
                                                                toast.error("An error occurred!")
                                                            }
                                                        })
                                                    }}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                </motion.button>
                                            </motion.div>
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