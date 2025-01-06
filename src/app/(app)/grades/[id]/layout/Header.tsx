import type { Grades, Period } from "@/hooks/useGrades"
import type { Section } from "@/contexts/AuthContext"

import Link from "next/link"
import Image from "next/image"

import { useMediaQuery } from "@/hooks/useMediaQuery"

import NumberFlow from "@number-flow/react"

import DataControl from "./DataControl"
import PeriodSelect from "./PeriodSelect"

import { ArrowLeft } from "lucide-react"

interface HeaderProps {
    section: Section
    grades: Grades
    period: Period
    periods: Period[]
    setPeriod: (id: string) => void
    refresh: () => void
    refreshing: boolean
}
export default function Header(props: HeaderProps) {
    const { section, grades, period, periods, setPeriod, refresh, refreshing } = props
    const desktop = useMediaQuery("(min-width: 768px)")

    return desktop ? (
        <div
            style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background) 100%)" }}
            className="flex relative bottom-0 m-0 mx-8 px-8 py-4 border-2 border-tertiary rounded-lg"
        >
            <div className="space-y-1">
                <Link href="/grades" className="flex text-sm text-secondary hover:underline">
                    <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                </Link>
                <div className="text-xl font-extrabold">
                    <p className="text-3xl text-primary">{section.name}</p>
                    <p className="text-2xl text-secondary">{section.section}</p>
                </div>
            </div>
            <div className="my-auto ml-6 space-y-1.5">
                <DataControl
                    timestamp={grades.timestamp}
                    refresh={refresh}
                    refreshing={refreshing}
                />
                <PeriodSelect
                    period={period}
                    periods={periods}
                    setPeriod={setPeriod}
                />
            </div>
            {!!period.calculated && (
                <div className="ml-auto mt-auto text-right">
                    <div className={`flex ml-auto w-20 bg-primary rounded-lg text-tertiary ${period.calculated === period.grade && "opacity-0"} ${period.calculated > period.grade ? "bg-primary" : "bg-secondary"} transition-all duration-200`}>
                        <NumberFlow
                            className="m-auto py-1 font-bold text-xs text-background"
                            value={Math.round((period.calculated - period.grade + Number.EPSILON) * 100) / 100}
                            prefix={period.calculated > period.grade ? "+" : ""}
                            suffix="%"
                            continuous
                        />
                    </div>
                    <NumberFlow
                        className="text-3xl pt-2 font-bold"
                        value={period.calculated}
                        suffix="%"
                        continuous
                    />
                </div>
            )}
            <Image
                fill
                className="-z-10 object-cover opacity-20"
                src={section.image}
                alt={section.name}
            />
        </div>
    ) : (
        // Mobile layout
        <div
            style={{ background: "linear-gradient(270deg, rgba(0,0,0,0) 0%, var(--background) 100%)" }}
            className="relative m-3 mb-0 py-2 border-2 border-tertiary rounded-lg"
        >
            <div className="flex w-full px-4">
                <div className="w-1/2">
                    <Link href="/grades" className="flex text-sm text-secondary">
                        <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                    </Link>
                    <p className="text-2xl text-primary font-bold truncate">{section.name}</p>
                </div>
                {!!period.calculated && (
                    <NumberFlow
                        className="w-1/2 truncate text-right ml-auto my-auto text-3xl font-bold"
                        value={period.calculated}
                        suffix="%"
                        continuous
                    />
                )}
            </div>
            <PeriodSelect
                period={period}
                periods={periods}
                setPeriod={setPeriod}
                className="px-2 pt-1"
            />
            <Image
                fill
                className="-z-10 object-cover opacity-10"
                src={section.image}
                alt={section.name}
            />
        </div>
    )
}