import { useState } from "react"
import { DateTime } from "luxon"

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

import type { CategoricalChartState } from "recharts/types/chart/types"

import {
    ChartContainer,
    ChartTooltip
} from "@/components/ui/chart"

import Loader from "@/components/Loader"
import NumberFlow from "@number-flow/react"
import { Checkbox } from "@/components/ui/checkbox"
import { AnimatePresence, motion } from "motion/react"

interface GraphProps {
    grades: Grades
    periodId: string
}
export default function Graph(props: GraphProps) {
    const { grades, periodId } = props

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

    // const [current, setCurrent] = useState<CategoricalChartState>({
    //     activeLabel: points[points.length - 1].timestamp.toString()
    // })

    const [timestamp, setTimestamp] = useState(points[points.length - 1].timestamp)

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

    const time = DateTime.fromSeconds(timestamp)

    const [year, month, day, hour, minute] = time
        .toFormat("yy MM dd HH mm ss")
        .split(" ")
        .map(Number)

    const current = points.find(point => point.timestamp === timestamp)!

    return (
        <div className="bg-tertiary p-1 md:p-4 w-full h-full">
            <div className="h-1/3">
                <ResponsiveContainer className="bg-background rounded-t-md p-2 md:p-3">
                    <ChartContainer config={{}}>
                        <LineChart
                            data={points}
                            onMouseMove={e => e.isTooltipActive
                                && e.activeLabel
                                && timestamp !== +e.activeLabel
                                && setTimestamp(+e.activeLabel)}
                        >
                            <CartesianGrid
                                strokeDasharray="3"
                                vertical={false}
                            />
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
                            <ChartTooltip content={() => <></>} />
                            <Line
                                name={periodId}
                                dataKey="grades.calculated"
                                stroke="var(--primary)"
                                strokeWidth={4}
                                dot={false}
                            />
                            {Object
                                .values(points[0].grades.categories)
                                .map(category => (
                                    <Line
                                        key={category.id}
                                        name={category.id}
                                        dataKey={`grades.categories.${category.id}.calculated`}
                                        stroke="var(--secondary)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                        </LineChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </div>
            <div className="h-2/3">
                <div className="h-auto bg-primary rounded-b-md p-2 pl-4 flex justify-between">
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
                <div className="flex h-[calc(100%-54px)] space-x-1 md:space-x-2 mt-1 md:mt-2">
                    <div className="w-1/2 overflow-y-auto font-bold text-xs md:text-lg">
                        <div className="flex justify-between bg-primary text-background px-2 py-1 rounded-md">
                            <p>Final Grade</p>
                            <p>{current.grades.calculated}%</p>
                        </div>
                        <div className="space-y-1 mt-1">
                            <AnimatePresence>
                                {Object
                                    .values(current.grades.categories)
                                    .filter(category => category.calculated)
                                    .sort((a, b) => b.weight - a.weight)
                                    .map(category => (
                                        <motion.div
                                            key={category.id}
                                            className="flex justify-between bg-secondary text-background px-2 py-1 rounded-md"
                                            exit={{
                                                opacity: 0,
                                                transition: { duration: 0.2 }
                                            }}
                                            layout
                                        >
                                            <p className="truncate mr-2">{category.name}</p>
                                            <p>{category.calculated}%</p>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="w-1/2">
                        :3
                    </div>
                </div>
            </div>
        </div>
    )
}