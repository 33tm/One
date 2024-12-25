import type { Period } from "@/hooks/useGrades"

import { DateTime } from "luxon"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PeriodSelectProps {
    period: Period
    periods: Period[]
    setPeriod: (id: string) => void
    className?: string
}
export default function PeriodSelect(props: PeriodSelectProps) {
    const { period, periods, setPeriod, className } = props

    const start = DateTime.fromSeconds(period.start).toFormat("DDD")
    const end = DateTime.fromSeconds(period.end).toFormat("DDD")

    return (
        <div className={`${className}`}>
            <div className="flex">
                <Select
                    value={period.id}
                    onValueChange={setPeriod}
                >
                    <SelectTrigger className="w-32 text-xs rounded-r-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {periods.map(period => (
                            <SelectItem
                                key={period.id}
                                onClick={() => setPeriod(period.id)}
                                value={period.id}
                            >
                                {period.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className="w-32 text-xs text-center rounded-l-none hover:cursor-default">
                    <div>
                        <p>{start}</p>
                        <Separator className="opacity-10 rounded w-24" />
                        <p>{end}</p>
                    </div>
                </Button>
            </div>
        </div>
    )
}