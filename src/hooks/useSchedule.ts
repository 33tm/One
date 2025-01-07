import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { useMediaQuery } from "./useMediaQuery"

export function useSchedule() {
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<string>()
    const [schedule, setSchedule] = useState<{
        period: string
        start: string
        end: string
    }>()

    const desktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        if (desktop || !user) return
        setMessage("Touch to open")
        setTimeout(() => setLoading(false), 200)
        setTimeout(() => setLoading(true), 2000)
        setTimeout(() => setLoading(false), 2400)
        setTimeout(() => setMessage(undefined), 2400)
    }, [desktop, user])

    useEffect(() => {
        const toTime = (time: number) => `${Math.floor(time / 60 - (+(time / 60 >= 13) * 12))}:${(time % 60).toString().padStart(2, "0")}`
        const getSeconds = (time: Date) => time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()
        const hasPeriod = (period: number) =>
            user && user.sections.some(section => section.period === period)
                ? "true"
                : "false"

        const controller = new AbortController()

        async function update() {
            setLoading(true)

            if (user && !user.gunn)
                return setTimeout(() => setSchedule(undefined), 200)

            const query = user ? new URLSearchParams({
                period0: hasPeriod(0),
                period8: hasPeriod(8),
                gradYear: `${user.class}`
            }).toString() : ""

            fetch(`https://gunnwatt.web.app/api/next-period?${query}&timestamp=`, { signal: controller.signal })
                .then(res => res.json())
                .then((status: Response) => {
                    if (!status?.next) return
                    const { next } = status
                    const period =
                        {
                            "B": "Brunch",
                            "L": "Lunch",
                            "P": "PRIME",
                            "S": "SELF",
                            "H": "Study Hall"
                        }[next.n]
                        || user?.sections.find(section => section.period === +next.n)?.name
                        || `Period ${next.n}`

                    setSchedule({
                        period,
                        start: toTime(next.s),
                        end: toTime(next.e)
                    })

                    setLoading(false)

                    setTimeout(() => {
                        setLoading(true)
                        update()
                        // Milliseconds till period end
                    }, (next.e * 60 - getSeconds(new Date())) * 1000)
                })
                .catch(() => { })
        }

        update()

        return () => controller.abort(null)
    }, [user])

    return { schedule, message, loading }
}

// https://github.com/GunnWATT/watt/blob/main/shared/data/schedule.ts#L8
interface PeriodObj {
    n: string
    s: number
    e: number
    note?: string
    grades?: number[]
}

interface Response {
    prev: PeriodObj | null
    next: PeriodObj | null
    startingIn: number
    endingIn: number
    nextSeconds: number
    minutes: number
    seconds: number
}