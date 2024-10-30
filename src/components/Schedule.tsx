import Link from "next/link"
import { useSchedule } from "@/hooks/useSchedule"

export function Schedule() {
    const { schedule, status } = useSchedule()

    return (
        <div className={`flex m-auto space-x-1.5 text-sm text-muted-foreground transition-opacity ease-in duration-200 ${!status && "opacity-0"}`}>
            {schedule && (
                <>
                    <p className="font-bold">{schedule.period}</p>
                    <p>{schedule.start}-{schedule.end}</p>
                </>
            )}
        </div>
    )
}