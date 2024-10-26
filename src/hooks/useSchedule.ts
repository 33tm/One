import { useCallback, useEffect, useState } from "react"
import type { UserType } from "@/contexts/AuthContext"

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

export function useSchedule(user: UserType | null) {
    const [status, setStatus] = useState<Response>()
    const [schedule, setSchedule] = useState<{
        period: string
        start: string
        end: string
    }>()

    const update = useCallback(() => {
        const hasPeriod = (period: number) =>
            user && user.sections.some(section => section.period === period)
                ? "true"
                : "false"

        const query = user ? new URLSearchParams({
            period0: hasPeriod(0),
            period8: hasPeriod(8),
            gradYear: user.class.toString()
        }).toString() : ""

        fetch(`https://gunnwatt.web.app/api/next-period?${query}`)
            .then(res => res.json())
            .then(setStatus)
    }, [user])

    useEffect(update, [update])

    useEffect(() => {
        const toTime = (time: number) => `${Math.floor(time / 60 - (+(time / 60 >= 13) * 12))}:${(time % 60).toString().padStart(2, "0")}`
        const getSeconds = (time: Date) => time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()

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

        setTimeout(() => {
            setStatus(undefined)
            update()
            // Milliseconds till period end
        }, (next.e * 60 - getSeconds(new Date())) * 1000)
    }, [status, user, update])

    return { schedule, status }
}