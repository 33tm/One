import { useSchedule } from "@/hooks/useSchedule"

export function Schedule({ className }: { className?: string }) {
    const { schedule, message, loading } = useSchedule()

    return (
        <div className={`${className} flex mr-auto my-auto space-x-1.5 text-sm text-secondary transition-opacity ease-in duration-200 ${loading && "opacity-0"}`}>
            {message
                ? <p className="font-semibold">{message}</p>
                : schedule && (
                    <>
                        <p className="font-bold">{schedule.period}</p>
                        <p>{schedule.start}-{schedule.end}</p>
                    </>
                )}
        </div>
    )
}