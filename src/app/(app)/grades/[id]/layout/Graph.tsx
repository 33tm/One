import type { Assignment } from "@/hooks/useGrades"

export default function Graph({ assignments }: { assignments: Assignment[] }) {
    console.log(assignments)
    return (
        <div className="flex h-full w-full">
            <p className="m-auto">Coming soon!</p>
        </div>
    )
}