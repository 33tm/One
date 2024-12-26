import Link from "next/link"

import { motion } from "motion/react"
import NumberFlow from "@number-flow/react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import type { Assignment } from "@/hooks/useGrades"

import { Plus, X } from "lucide-react"

interface AssignmentProps {
    assignment: Assignment
    drop: () => void
    modify: (grade: number | null, type: "grade" | "max") => void
    weight: number
    animate: boolean
}
function Assignment(props: AssignmentProps) {
    const {
        assignment,
        drop,
        modify,
        weight,
        animate
    } = props
    const {
        custom,
        grade,
        max,
        drop: dropped,
        name,
        url,
        new: isNew
    } = assignment
    const isCustom = custom !== null && custom !== grade
    return (
        <motion.div
            className={`flex pl-5 pr-2 py-2 space-x-2 justify-between rounded-lg ${isNew ? "bg-secondary" : "bg-tertiary"} shadow-md`}
            layout
        >
            <motion.div
                className="flex my-auto mr-2 w-4 h-4 hover:cursor-pointer"
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={drop}
            >
                {isNew ? (
                    <X
                        size={24}
                        // onClick={drop}
                        className="w-4 h-4 text-background"
                    />
                ) : (
                    <Checkbox
                        className="my-auto"
                        checked={!dropped || custom === undefined}
                    />
                )}
            </motion.div>
            <div className={`my-auto w-full truncate ${isCustom && "font-bold"} ${dropped && "line-through text-secondary"} transition-all duration-200`}>
                {url ? (
                    <Link
                        href={url}
                        target="_blank"
                        className={`${isNew && "text-background"} truncate hover:underline`}
                    >
                        {name}
                    </Link>
                ) : (
                    <p className={`${isNew && "text-background"} truncate hover:cursor-not-allowed`}>
                        {name}
                    </p>
                )}
            </div>
            <div className="flex justify-end space-x-2 font-bold">
                <NumberFlow
                    value={weight}
                    prefix={weight > 0 ? "+" : ""}
                    suffix="%"
                    className={`min-w-28 ml-auto rounded-lg text-center text-background ${weight > 0 ? "bg-primary" : (isNew ? "text-primary bg-background" : "bg-secondary")} p-2 opacity-0 ${!dropped && !isNaN(weight) && "opacity-100"} transition-all duration-200`}
                    animated={animate}
                    continuous
                />
                <div className={`flex outline outline-secondary rounded-md ${dropped && "text-secondary line-through"} transition-all duration-200`}>
                    <Input
                        disabled={dropped}
                        className={`w-20 text-center ${isNew && "rounded-r-none"}`}
                        placeholder={isNew ? "0" : (grade ? grade.toString() : "-")}
                        defaultValue={(custom && custom !== grade) ? custom.toString() : ""}
                        onChange={({ target }) => {
                            const grade = parseFloat(target.value)
                            modify(isNaN(grade) ? null : grade, "grade")
                        }}
                    />
                    {isNew ? (
                        <Input
                            disabled={dropped}
                            className="w-20 text-center  rounded-l-none"
                            placeholder={max ? max.toString() : "10"}
                            defaultValue={max === 10 ? "" : max.toString()}
                            onChange={({ target }) => {
                                const grade = parseFloat(target.value)
                                modify(isNaN(grade) ? 10 : grade, "max")
                            }}
                        />
                    ) : (
                        <p className="my-auto w-20 text-center hover:cursor-not-allowed">
                            {max}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

interface AssignmentsProps {
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, grade: number | null, type: "grade" | "max") => void
    weight: (assignment: string) => number
    create: () => void
}
export default function Assignments(props: AssignmentsProps) {
    const { assignments, drop, modify, weight, create } = props
    const animate = assignments.length < 10
    return (
        <div className="w-3/4 pr-3 pt-3 min-w-0 h-full space-y-2.5">
            <div className="flex h-14 pr-2 pl-5 justify-between bg-primary text-background rounded-lg shadow-md shadow-secondary">
                <p className="my-auto text-background font-semibold">
                    New Assignment
                </p>
                <motion.button
                    className="flex my-auto w-10 h-10 rounded-lg outline outline-secondary"
                    onClick={create}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Plus className="m-auto w-5 h-5" />
                </motion.button>
            </div>
            <div className="h-[calc(100%-66px)] space-y-2.5 overflow-y-auto rounded-lg">
                {/* No AnimatePresence here since an exit animation only makes the experience less snappy */}
                {assignments
                    .sort((a, b) => +b.new - +a.new)
                    .map(item => (
                        <Assignment
                            key={item.id}
                            assignment={item}
                            drop={() => drop(item.id)}
                            modify={(grade, type) => modify(item.id, grade, type)}
                            weight={weight(item.id)}
                            animate={animate}
                        />
                    ))}
            </div>
        </div>
    )
}