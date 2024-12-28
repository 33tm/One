import type { Assignment, Category } from "@/hooks/useGrades"

import { motion } from "motion/react"

import { Plus } from "lucide-react"
import NumberFlow from "@number-flow/react"

interface AssignmentProps {
    assignment: Assignment
    drop: () => void
    modify: (value: number | null, type: "grade" | "max") => void
    weight: () => void
}
function Assignment(props: AssignmentProps) {
    const {
        assignment,
        drop,
        modify,
        weight
    } = props
    return (
        <div className="">
            <p>{assignment.name}</p>
        </div>
    )
}

interface CategoryProps {
    category: Category
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, value: number | null, type: "grade" | "max") => void
    weight: (id: string) => void
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
        <>
            <div className="flex h-12 p-2 rounded-lg justify-between bg-primary text-background">
                <div className="flex w-1/2 space-x-1.5 ml-2 my-auto">
                    <p className="truncate">
                        {category.name}
                    </p>
                    {category.weight && (
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
            {assignments.map(assignment => (
                <Assignment
                    key={assignment.id}
                    assignment={assignment}
                    drop={() => drop(assignment.id)}
                    modify={(value: number | null, type: "grade" | "max") => modify(assignment.id, value, type)}
                    weight={() => weight(assignment.id)}
                />
            ))}
        </>
    )
}

interface CombinationProps {
    categories: Category[]
    assignments: Assignment[]
    drop: (id: string) => void
    modify: (id: string, value: number | null, type: "grade" | "max") => void
    weight: (id: string) => void
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