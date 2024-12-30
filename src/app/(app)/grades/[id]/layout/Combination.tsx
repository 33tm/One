import type { Assignment, Category } from "@/hooks/useGrades"

import { AnimatePresence, motion } from "motion/react"
import NumberFlow from "@number-flow/react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { Plus, X } from "lucide-react"

interface AssignmentProps {
    assignment: Assignment
    drop: () => void
    modify: (value: number | null, type: "grade" | "max") => void
    weight: number
}
function Assignment(props: AssignmentProps) {
    const {
        assignment,
        drop,
        modify,
        weight
    } = props
    const {
        custom,
        grade,
        max,
        drop: dropped,
        name,
        new: isNew
    } = assignment
    const isCustom = custom !== null && custom !== grade

    return (
        <motion.div
            className={`flex rounded-lg ${isNew ? "bg-secondary text-background" : "bg-tertiary"}`}
            animate={{ height: dropped ? "36px" : "64px" }}
        >
            <div
                className={`flex min-w-10 rounded-l-lg hover:cursor-pointer ${isNew && "bg-tertiary"}`}
                onClick={drop}
            >
                {isNew ? (
                    <X
                        size={24}
                        className="m-auto w-4 h-4 text-primary"
                    />
                ) : (
                    <Checkbox
                        className="w-full h-full rounded-l-lg rounded-r-none"
                        checked={!dropped || custom === undefined}
                    />
                )}
            </div>
            <div className="m-2 space-y-1 min-w-0 w-full">
                <p className={`truncate text-sm ${dropped && "line-through text-secondary"} ${isCustom && "font-bold"} transition-all duration-200`}>
                    {name}
                </p>
                <AnimatePresence initial={false}>
                    {dropped || (
                        <motion.div
                            className="flex h-6 justify-between font-semibold text-xs"
                            {...isNew ? {} : {
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                transition: { delay: 0.1 }
                            }}
                        >
                            <p
                                className={`
                            my-auto w-20 h-full p-1
                            text-center text-background
                            rounded-md
                            ${weight > 0 ? "bg-primary" : (isNew ? "text-primary bg-background" : "bg-secondary")}
                            ${(dropped || isNaN(weight)) && "opacity-0"}
                            transition-all duration-200
                        `}
                            >
                                {weight > 0 && "+"}{weight}%
                            </p>
                            <div
                                className={`
                            flex outline outline-secondary rounded-md text-xs
                            ${dropped && "text-secondary line-through"}
                            transition-all duration-200
                        `}
                            >
                                <Input
                                    type="number"
                                    disabled={dropped}
                                    className={`
                                    w-16 h-6 text-xs text-center text-primary
                                    ${isNew && "rounded-r-none"}
                                `}
                                    placeholder={isNew ? "0" : (grade ? grade.toString() : "-")}
                                    defaultValue={(custom && custom !== grade) ? custom.toString() : ""}
                                    onChange={({ target }) => {
                                        const grade = parseFloat(target.value)
                                        modify(isNaN(grade) ? null : grade, "grade")
                                    }}
                                />
                                {isNew ? (
                                    <Input
                                        type="number"
                                        disabled={dropped}
                                        className="w-16 h-6 text-xs text-center text-primary rounded-l-none"
                                        placeholder={max ? max.toString() : "10"}
                                        defaultValue={max === 10 ? "" : max.toString()}
                                        onChange={({ target }) => {
                                            const grade = parseFloat(target.value)
                                            modify(isNaN(grade) ? 10 : grade, "max")
                                        }}
                                    />
                                ) : (
                                    <p className="my-auto w-16 text-center hover:cursor-not-allowed">
                                        {max}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div >
    )
}

interface CategoryProps {
    category: Category
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, value: number | null, type: "grade" | "max") => void
    weight: (id: string) => number
    create: () => void
}
function Category(props: CategoryProps) {
    const {
        category,
        assignments,
        drop,
        modify,
        weight,
        create
    } = props
    return (
        <div className="space-y-2">
            <div className="flex h-12 p-2 rounded-lg justify-between bg-primary text-background">
                <div className="flex w-1/2 space-x-1.5 ml-2 my-auto">
                    <p className="truncate">
                        {category.name}
                    </p>
                    {!!category.weight && (
                        <p className="text-secondary font-medium">
                            ({category.weight}%)
                        </p>
                    )}
                </div>
                <div className="flex w-1/2 space-x-3 justify-end">
                    <NumberFlow
                        className={`ml-2 truncate my-auto font-semibold text-right ${category.calculated || "opacity-0"} transition-opacity duration-200`}
                        value={category.calculated || 0}
                        suffix="%"
                        continuous
                    />
                    <motion.button
                        className="flex my-auto w-8 h-8 rounded-lg outline outline-secondary"
                        onClick={create}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Plus className="m-auto w-4 h-4" />
                    </motion.button>
                </div>
            </div>
            {assignments
                .sort((a, b) => +b.new - +a.new)
                .map(assignment => (
                    <Assignment
                        key={assignment.id}
                        assignment={assignment}
                        drop={() => drop(assignment.id)}
                        modify={(value: number | null, type: "grade" | "max") => modify(assignment.id, value, type)}
                        weight={weight(assignment.id)}
                    />
                ))}
        </div>
    )
}

interface CombinationProps {
    categories: Category[]
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, value: number | null, type: "grade" | "max") => void
    weight: (id: string) => number
    create: (categoryId: string) => void
}
export default function Combination(props: CombinationProps) {
    const {
        categories,
        assignments,
        drop,
        modify,
        weight,
        create
    } = props

    return (
        <div className="space-y-2 overflow-y-auto">
            {categories.map(category => (
                <Category
                    key={category.id}
                    category={category}
                    assignments={assignments.filter(assignment => assignment.category === category.id)}
                    drop={drop}
                    modify={modify}
                    weight={weight}
                    create={() => create(category.id)}
                />
            ))}
        </div>
    )
}