import Link from "next/link"

import Error from "@/components/Error"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { ArrowLeft } from "lucide-react"

import type { Category, Period } from "@/hooks/useGrades"

interface CalculationErrorProps {
    section: {
        name: string
        section: string
    }
    period: Period
    categories: Category[]
    refreshing: boolean
    dismiss: () => void
}
export default function CalculationError(props: CalculationErrorProps) {
    const {
        section,
        period,
        categories,
        refreshing,
        dismiss
    } = props
    return (
        <>
            <title>
                {`${section.name} | One`}
            </title>
            <Error>
                <Link href="/grades" className="fixed flex left-4 top-28 md:left-8 md:top-20 text-sm text-secondary hover:underline">
                    <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                </Link>
                <p className="font-bold mb-2">Failed to calculate grades!</p>
                <p className="text-xs mb-1">This is likely caused by an assignment with unpublished grades.</p>
                <p className="text-xs mb-4">Would you like to ignore this and continue?</p>
                <div className="mx-4 w-auto">
                    <div className="rounded-t-lg bg-tertiary font-mono p-4">
                        <div className="flex justify-between font-black">
                            <p>{section.name}</p>
                            <p>{section.section}</p>
                        </div>
                        <div className="flex">
                            <p className="text-left truncate w-1/2">{period.name}</p>
                            <div className="flex w-1/2 space-x-3">
                                <p className="text-right w-1/2">calc%</p>
                                <p className="text-right w-1/2">grade%</p>
                            </div>
                        </div>
                        <Separator className="bg-secondary my-1 rounded" />
                        {categories.map(category => (
                            <div key={category.id} className={`flex ${category.grade !== category.calculated && "font-bold underline"}`}>
                                <p className="text-left truncate w-1/2">{category.name}</p>
                                <div className="flex w-1/2 space-x-3">
                                    <p className="text-right w-1/2">{category.calculated}%</p>
                                    <p className="text-right w-1/2">{category.grade}%</p>
                                </div>
                            </div>
                        ))}
                        <Separator className="bg-secondary my-1 rounded" />
                        <div className="flex font-black">
                            <p className="text-left truncate w-1/2">Total</p>
                            <div className={`ml-auto flex w-1/2 space-x-3 ${period.grade !== period.calculated && "underline"}`}>
                                <p className="text-right w-1/2">{period.calculated}%</p>
                                <p className="text-right w-1/2">{period.grade}%</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        disabled={refreshing}
                        onClick={dismiss}
                        className="w-full rounded-t-none transition-all duration-200"
                    >
                        {refreshing ? "Refreshing..." : "Ignore"}
                    </Button>
                    <p className="mt-4 text-secondary text-xs">
                        Grade calculations will be inaccurate.
                    </p>
                </div>
            </Error>
        </>
    )
}