import { useEffect, useState } from "react"
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

    function update() {
        const hasPeriod = (period: number) =>
            user && user.sections.some(section => section.period === period)
                ? "true"
                : "false"

        const query = user ? new URLSearchParams({
            date: new Date(1729706762000).toISOString(),
            period0: hasPeriod(0),
            period8: hasPeriod(8),
            gradYear: user.class.toString()
        }).toString() : ""

        fetch(`https://gunnwatt.web.app/api/next-period?${query}`)
            .then(res => res.json())
            .then(setStatus)
    }

    useEffect(update, [user])

    return ""
}