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
    const isCustom = custom !== null && custom !== grade
    return (
        <div className="flex pl-5 pr-2 py-2 space-x-2 justify-between rounded-lg bg-tertiary shadow-md">
            <Checkbox
                className="my-auto mr-2"
                checked={!dropped || custom === undefined}
                onCheckedChange={drop}
            />
            <div className={`my-auto w-full truncate ${isCustom && "font-bold"} ${dropped && "line-through text-secondary"} transition-all duration-200`}>
                {url ? (
                    <Link
                        href={url}
                        target="_blank"
                        className="truncate hover:underline"
                    >
                        {name}
                    </Link>
                ) : (
                    <p className="truncate hover:cursor-not-allowed">
                        {name}
                    </p>
                )}
            </div>
            <div className="flex justify-end space-x-2 font-bold select-none">
                <NumberFlow
                    value={weight}
                    prefix={weight > 0 ? "+" : ""}
                    suffix="%"
                    className={`min-w-28 ml-auto rounded-lg text-center bg-primary text-tertiary p-2 opacity-0 ${!dropped && !isNaN(weight) && "opacity-100"} transition-opacity duration-200`}
                    continuous
                />
                <div className={`flex outline outline-secondary rounded-md ${dropped && "text-secondary line-through"} transition-all duration-200`}>
                    <Input
                        disabled={dropped}
                        className="w-20 text-center"
                        placeholder={grade ? grade.toString() : "-"}
                        defaultValue={(custom && custom !== grade) ? custom.toString() : ""}
                        onChange={({ target }) => {
                            const grade = parseFloat(target.value)
                            modify(isNaN(grade) ? null : grade)
                        }}
                    />
                    <p className="my-auto w-20 text-center">
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
        <div className="w-3/4 min-w-0 h-full pl-3 space-y-2.5">
            <div className="flex h-14 pr-2 pl-5 justify-between bg-primary text-background rounded-lg shadow-md shadow-primary">
                <p className="my-auto text-background font-semibold">
                    New Assignment
                </p>
                <Button className="my-auto w-10 h-10 rounded-lg outline outline-secondary hover:scale-105 transition-transform duration-200">
                    <Plus size={24} />
                </Button>
            </div>
            <div className="h-[calc(100%-66px)] space-y-2.5 overflow-y-auto rounded-lg">
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