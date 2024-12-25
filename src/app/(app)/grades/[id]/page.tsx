"use client"

import Link from "next/link"
import Image from "next/image"
import NumberFlow from "@number-flow/react"
import { toast } from "sonner"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import Categories from "./layout/Categories"
import Assignments from "./layout/Assignments"
import CalculationError from "./layout/CalculationError"
import PeriodSelect from "./layout/PeriodSelect"

import Loader from "@/components/Loader"
import Error from "@/components/Error"

import { ArrowLeft } from "lucide-react"
import DataControl from "./layout/DataControl"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)

    const {
        grades,
        error,
        modify,
        drop,
        weight,
        create,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refresh,
        refreshing
    } = useGrades(id)

    const [dismiss, setDismiss] = useState(false)

    const [periodId, setPeriod] = useState<string>()
    const [categoryId, setCategoryId] = useState<string>()
    const [warningCategoryId, setWarningCategoryId] = useState<string>()

    const periods = Object.values(grades.periods)

    useEffect(() => {
        if (!grades.periods || !periods.length)
            return

        if (!periodId) {
            const now = Date.now() / 1000
            const period = periods.find(period => {
                const start = period.start
                const end = period.end
                return start <= now && now <= end
            })
            setPeriod(period?.id || periods[0].id)
        }

        const categories = Object
            .values(periods[0].categories)
            .sort((a, b) => b.weight - a.weight)
        if (!categoryId)
            setCategoryId(categories[0].id)
    }, [grades, periods, periodId, categoryId])

    useEffect(() => {
        if (!user && !loading)
            router.push("/grades")
    }, [user, loading, router])

    if (!user) return <Error>Invalid user!</Error>

    const section = user.sections.find(section => section.id === id)

    if (!section) return <Error>Invalid state!</Error>

    const title = `${section.name} | One`

    if (error && error !== "calc") {
        return (
            <Error title={title}>
                <Link href="/grades" className="fixed flex left-4 top-28 md:left-8 md:top-20 text-sm text-secondary hover:underline">
                    <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                </Link>
                {error}
            </Error>
        )
    }

    if (!periodId)
        return <Loader title={title} />

    if (!categoryId)
        return <Error title={title}>No categories found!</Error>

    const period = grades.periods[periodId]

    const categories = Object
        .values(period.categories)
        .sort((a, b) => b.weight - a.weight)

    const assignments = Object
        .values(grades.assignments)
        .filter(item => item.period === period.id && item.category === categoryId)

    if (error && error === "calc" && !dismiss) {
        return (
            <CalculationError
                section={section}
                period={period}
                categories={categories}
                dismiss={() => setDismiss(true)}
                refreshing={refreshing}
            />
        )
    }

    if (assignments.length > 10 && warningCategoryId !== categoryId) {
        setWarningCategoryId(categoryId)
        toast.info("Animations disabled for performance.")
    }

    return (
        <>
            <title>
                {`${section.name} | One`}
            </title>
            <div
                style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background) 100%)" }}
                className="flex relative bottom-0 mx-8 px-8 py-4 outline outline-2 outline-tertiary rounded-lg"
            >
                <div className="space-y-1">
                    <Link href="/grades" className="flex text-sm text-secondary hover:underline">
                        <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                    </Link>
                    <Link
                        href={`${user.domain}/course/${section.id}`}
                        className="hover:underline"
                        target="_blank"
                    >
                        <div className="text-xl font-extrabold">
                            <p className="md:text-3xl text-primary">{section.name}</p>
                            <p className="md:text-2xl text-secondary">{section.section}</p>
                        </div>
                    </Link>
                </div>
                <div className="my-auto ml-8 space-y-2">
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
                    priority
                    className="-z-10 object-cover opacity-20 rounded-lg"
                    src={section.image}
                    alt={section.name}
                />
            </div >
            <div className="flex mx-5 h-[calc(100dvh-204px)]">
                <Categories
                    category={categoryId}
                    categories={categories}
                    setCategory={setCategoryId}
                />
                <Assignments
                    assignments={assignments}
                    drop={drop}
                    modify={modify}
                    weight={weight}
                    create={() => create(period.id, categoryId)}
                />
            </div>
        </>
    )
}