import {
    calculate,
    type Grades
} from "@/hooks/useGrades"

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts"

import { DateTime } from "luxon"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import Loader from "@/components/Loader"
import { useState } from "react"

interface GraphProps {
    grades: Grades
    periodId: string
}
export default function Graph(props: GraphProps) {
    const { grades, periodId } = props
    const [selection, setSelection] = useState<{
        start?: number
        end?: number
    }>()

    const assignments = Object
        .entries(grades.assignments)
        .sort(([, a], [, b]) => a.updated - b.updated)

    const points = Array
        .from({ length: assignments.length }, (_, i) => i)
        .map(i => ({
            timestamp: assignments[i][1].updated,
            grades: calculate({
                ...grades,
                assignments: Object.fromEntries(assignments.slice(0, i + 1))
            }).periods[periodId]
        }))

    if (!points) return <Loader />

    const all = points
        .flatMap(point => [
            point.grades.calculated,
            ...Object
                .values(point.grades.categories)
                .map(category => category.calculated)
        ])
        .filter(Boolean)
        .sort((a, b) => a! - b!)

    const max = all[all.length - 1] || 100
    const min = all[0] || 0

    return (
        <div className="bg-tertiary p-4 w-full h-full">
            <div className="bg-background rounded-lg shadow-2xl p-3 w-full h-1/2">
                <ResponsiveContainer>
                    <ChartContainer config={{}}>
                        <LineChart
                            data={points}
                            onMouseDown={e => setSelection({
                                start: e.chartX
                            })}
                            onMouseMove={e => selection && setSelection(selection => ({
                                ...selection,
                                end: e.chartX
                            }))}
                            onMouseUp={() => {
                                console.log(selection)
                                setSelection(undefined)
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                height={15}
                                dataKey="timestamp"
                                domain={[
                                    points[0].timestamp,
                                    points[points.length - 1].timestamp
                                ]}
                                scale="time"
                                type="number"
                                tickFormatter={timestamp => DateTime.fromSeconds(timestamp).toFormat("LLL d")}
                                className="font-medium"
                            />
                            <YAxis
                                width={35}
                                domain={[Math.floor(min - 1), Math.ceil(max)]}
                                type="number"
                                tickFormatter={value => `${value}%`}
                                className="font-bold"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" hideLabel />}
                            />
                            <Line
                                name={grades.periods[periodId].name}
                                dataKey="grades.calculated"
                                type="linear"
                                stroke="var(--primary)"
                                strokeWidth={4}
                                dot={false}
                            />
                            {Object
                                .values(points[0].grades.categories)
                                .map(category => (
                                    <Line
                                        key={category.id}
                                        dataKey={`grades.categories.${category.id}.calculated`}
                                        name={category.name}
                                        type="linear"
                                        stroke="var(--secondary)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                        </LineChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </div>
            <div className="p-3 w-full h-1/2">

            </div>
        </div >
    )
}