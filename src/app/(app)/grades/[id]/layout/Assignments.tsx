import Link from "next/link"

import NumberFlow from "@number-flow/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import type { Assignment } from "@/hooks/useGrades"

import { Plus } from "lucide-react"

interface AssignmentProps {
    assignment: Assignment
    drop: () => void
    modify: (grade: number | null) => void
    weight: number
}
function Assignment(props: AssignmentProps) {
    const { assignment, drop, modify, weight } = props
    const {
        custom,
        grade,
        max,
        drop: dropped,
        name,
        url
    } = assignment
    const isCustom = custom && custom !== grade
    return (
        <div className="flex justify-between rounded-lg bg-tertiary shadow-md">
            <div className="flex my-auto w-7/12 space-x-2 font-medium p-4">
                <Checkbox
                    className="my-auto mx-2"
                    checked={!dropped || custom === undefined}
                    onCheckedChange={drop}
                />
                <div className={`${isCustom && "font-bold"} ${dropped && "line-through text-secondary"} w-full truncate transition-all duration-200`}>
                    {url ? (
                        <Link
                            href={url}
                            target="_blank"
                            className="hover:underline truncate"
                        >
                            {name}
                        </Link>
                    ) : (
                        <p className="hover:cursor-not-allowed truncate">
                            {name}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex my-auto mr-2 space-x-3 font-bold">
                <NumberFlow
                    value={weight || 0}
                    prefix={weight > 0 ? "+" : ""}
                    suffix="%"
                    className={`my-auto w-24 select-none rounded-lg text-center bg-primary text-tertiary p-2 opacity-0 ${!dropped && !isNaN(weight) && "opacity-100"} transition-opacity duration-200`}
                    continuous
                />
                <div className={`flex font-mono outline outline-secondary rounded-lg ${dropped && "text-secondary"}`}>
                    <Input
                        className={`w-20 border-none text-center h-10 text-sm font-black ${dropped && "line-through"}`}
                        placeholder={grade ? grade.toString() : "-"}
                        onChange={({ target }) => {
                            const grade = parseFloat(target.value)
                            modify(isNaN(grade) ? null : grade)
                        }}
                    />
                    <p className={`w-20 my-auto text-center ${dropped && "line-through"}`}>
                        {max}
                    </p>
                </div>
            </div>
        </div>
    )
}

interface AssignmentsProps {
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, grade: number | null) => void
    weight: (assignment: string) => number
}
export default function Assignments(props: AssignmentsProps) {
    const { assignments, drop, modify, weight } = props
    return (
        <div className="w-3/4 h-full pl-3 space-y-2.5">
            <div className="flex h-14 px-2 justify-between bg-primary text-background rounded-lg shadow-md shadow-secondary">
                <p className="my-auto ml-4 text-background font-semibold">
                    New Assignment
                </p>
                <Button className="my-auto w-10 h-10 rounded-lg outline outline-secondary hover:scale-105 transition-transform duration-200">
                    <Plus size={24} />
                </Button>
            </div>
            <div className="h-[calc(100%-66px)] bg-background space-y-2.5 overflow-y-auto rounded-lg">
                {assignments.map(item => (
                    <Assignment
                        key={item.id}
                        assignment={item}
                        drop={() => drop(item.id)}
                        modify={(grade: number | null) => modify(item.id, grade)}
                        weight={weight(item.id)}
                    />
                ))}
            </div>
        </div>
    )
}