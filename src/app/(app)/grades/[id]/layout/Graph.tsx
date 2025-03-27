import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import NumberFlow from "@number-flow/react"

import {
    calculate,
    round,
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

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"

import Loader from "@/components/Loader"

interface GraphProps {
    grades: Grades
    periodId: string
}
export default function Graph(props: GraphProps) {
    const { grades, periodId } = props

    const assignments = Object
        .entries(grades.assignments)
        .sort(([, a], [, b]) => a.updated - b.updated)

    // const points = Array
    //     .from({ length: assignments.length }, (_, i) => i)
    //     .map(i => ({
    //         timestamp: assignments[i][1].updated,
    //         grades: calculate({
    //             ...grades,
    //             assignments: Object.fromEntries(assignments.slice(0, i + 1))
    //         })
    //     }))

    const points: { timestamp: number, grades: Grades }[] = []
    for (let i = 0; i <= assignments.length; i++) {
        const calculated = calculate({
            ...grades,
            assignments: Object.fromEntries(assignments.slice(0, i + 1))
        })

        const [, assignment] = assignments[i] || []

        if (
            !assignment
            || (points.length &&
                calculated.periods[periodId].calculated
                ===
                points[points.length - 1].grades.periods[periodId].calculated)
            || calculated.periods[periodId].calculated === 100
            || assignment.new
        ) continue

        points.push({
            timestamp: assignment.updated,
            grades: calculated
        })
    }

    const [timestamp, setTimestamp] = useState(points[points.length - 1].timestamp)

    useEffect(() => {
        document.getElementById(timestamp.toString())?.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        })
    }, [timestamp])

    if (!points) return <Loader />

    const all = points
        .flatMap(point => [
            point.grades.periods[periodId].calculated,
            ...Object
                .values(point.grades.periods[periodId].categories)
                .map(category => category.calculated)
        ])
        .filter(Boolean)
        .sort((a, b) => a! - b!)

    const max = all[all.length - 1] || 100
    const min = all[0] || 0

    const time = DateTime.fromSeconds(timestamp)

    const [year, month, day, hour, minute] = time
        .toFormat("yy MM dd HH mm ss")
        .split(" ")
        .map(Number)

    const current = points.find(point => point.timestamp === timestamp)!

    const categories = Object
        .values(current.grades.periods[periodId].categories)
        .filter(category => category.weight !== 0)

    return (
        <div className="flex flex-col justify-between p-1 bg-primary rounded-lg w-full h-full">
            <div className="h-[calc(50%-40px)] md:h-[calc(50%-46px)] w-full bg-background rounded-t-md">
                <ResponsiveContainer className="p-2">
                    <ChartContainer config={{}}>
                        <LineChart
                            data={points}
                            onMouseMove={e => e.isTooltipActive
                                && e.activeLabel
                                && timestamp !== +e.activeLabel
                                && setTimestamp(+e.activeLabel)}
                        >
                            <CartesianGrid strokeDasharray="3" />
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
                                domain={[
                                    Math.floor(min - 1),
                                    Math.ceil(max)
                                ]}
                                scale="linear"
                                type="number"
                                tickFormatter={value => `${value}%`}
                                className="font-bold"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                name="Final Grade"
                                dataKey={`grades.periods.${periodId}.calculated`}
                                stroke="var(--primary)"
                                strokeWidth={4}
                                dot={false}
                            />
                            {categories.map(category => (
                                <Line
                                    key={category.id}
                                    name={category.name}
                                    dataKey={`grades.periods.${periodId}.categories.${category.id}.calculated`}
                                    stroke="var(--secondary)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </LineChart>
                    </ChartContainer>
                </ResponsiveContainer>
                <div className="h-auto bg-primary p-2 pl-3 md:pl-4 flex justify-between">
                    <div className="flex text-md md:text-xl font-bold text-background">
                        <NumberFlow
                            value={year}
                            // update in 975 years
                            prefix="20"
                            continuous
                        />
                        <NumberFlow
                            value={month}
                            prefix="."
                            suffix="."
                            continuous
                        />
                        <NumberFlow
                            value={day}
                            continuous
                        />
                    </div>
                    <div className="flex justify-center h-auto w-24 bg-background text-sm md:text-md text-center rounded-md">
                        <p className="my-auto">
                            {hour % 12 || 12}:{minute.toString().padStart(2, "0")}{hour < 12 ? " AM" : " PM"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="h-1/2 bg-background rounded-b-md p-1 md:p-2">
                <div className="overflow-y-auto rounded-md space-y-1 h-full text-sm md:text-base">
                    {points.toReversed().map(point => {
                        const [, assignment] = assignments
                            .find(([, { updated }]) => updated === point.timestamp)!

                        const { calculated } = calculate({
                            ...grades,
                            assignments: Object.fromEntries(assignments
                                .filter(([, { updated }]) => updated < assignment.updated))
                        }).periods[periodId]

                        const difference = round(point.grades.periods[periodId].calculated - calculated)

                        const { grade, max } = grades.assignments[assignment.id]

                        const active = timestamp === point.timestamp

                        return (
                            <div
                                key={assignment.id}
                                id={point.timestamp.toString()}
                                className={`flex justify-between p-2 ${active ? "bg-primary text-background" : "bg-tertiary"} font-bold rounded-md`}
                            >
                                <p className="w-full truncate">{assignment.name}</p>
                                <div className={`${difference > 0 ? (active ? "bg-background text-primary" : "bg-primary") : "bg-secondary"} w-20 ml-2 text-background text-center rounded-md`}>
                                    {isNaN(difference)
                                        ? `-${round((1 - grade / max) * 100)}%`
                                        : `${difference > 0 ? "+" : ""}${difference}%`}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}