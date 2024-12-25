import type { Period } from "@/hooks/useGrades"
import { DateTime } from "luxon"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PeriodSelectProps {
    period: Period
    periods: Period[]
    setPeriod: (id: string) => void
    className?: string
}
export default function PeriodSelect(props: PeriodSelectProps) {
    const { period, periods, setPeriod, className } = props

    const start = DateTime.fromSeconds(period.start).toFormat("yyyy.M.d")
    const end = DateTime.fromSeconds(period.end).toFormat("yyyy.M.d")

    return (
        <div className={`${className}`}>
            <p className="text-xs">
                Grading Period
            </p>
            <div className="flex">
                <Select
                    value={period.id}
                    onValueChange={setPeriod}
                >
                    <SelectTrigger className="w-24 rounded-r-none">
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
                <Button className="text-xs rounded-l-none hover:cursor-default">
                    {start} - {end}
                </Button>
            </div>
        </div>
    )
}