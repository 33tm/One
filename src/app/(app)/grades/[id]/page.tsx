"use client"

import Link from "next/link"
import { toast } from "sonner"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import Header from "./layout/Header"
import Categories from "./layout/Categories"
import Assignments from "./layout/Assignments"
import Combination from "./layout/Combination"
import Graph from "./layout/Graph"
import CalculationError from "./layout/CalculationError"

import Loader from "@/components/Loader"
import Error from "@/components/Error"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ArrowLeft } from "lucide-react"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const desktop = useMediaQuery("(min-width: 768px)")

    const {
        grades,
        error,
        modify,
        drop,
        weight,
        create,
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

    const assignments = desktop
        ? Object
            .values(grades.assignments)
            .filter(item => item.period === period.id && item.category === categoryId)
        : Object
            .values(grades.assignments)
            .filter(item => item.period === period.id)

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

    if (desktop) {
        if (assignments.length > 10 && warningCategoryId !== categoryId) {
            setWarningCategoryId(categoryId)
            toast.info("Animations disabled for performance.", { duration: 1500 })
        } else if (assignments.length <= 10 && warningCategoryId === categoryId) {
            setWarningCategoryId(undefined)
        }
    }

    return (
        <Tabs defaultValue="calculate">
            <title>
                {`${section.name} | One`}
            </title>
            <Header
                section={section}
                grades={grades}
                period={period}
                periods={periods}
                setPeriod={setPeriod}
                refresh={refresh}
                refreshing={refreshing}
            />
            <TabsList className="flex mt-2 mx-3 md:mx-8">
                <TabsTrigger
                    value="calculate"
                    className="flex-1"
                >
                    Calculate
                </TabsTrigger>
                <TabsTrigger
                    value="visualize"
                    className="flex-1"
                >
                    Visualize
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="calculate"
                className="m-0"
            >
                {desktop ? (
                    <div className="flex mx-5 h-[calc(100dvh-248px)]">
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
                ) : (
                    <div className="mx-3 my-2 pb-2 h-[calc(100dvh-259px)] overflow-y-auto rounded-t-lg">
                        <Combination
                            categories={categories}
                            assignments={assignments}
                            drop={drop}
                            modify={modify}
                            weight={weight}
                            create={(categoryId: string) => create(period.id, categoryId)}
                        />
                    </div>
                )}
            </TabsContent>
            <TabsContent
                value="visualize"
                className="m-0"
            >
                {/* Use grades.assignments cause they're unfiltered */}
                {desktop ? (
                    <div className="flex mx-5 h-[calc(100dvh-248px)]">
                        <Graph assignments={Object.values(grades.assignments)} />
                    </div>
                ) : (
                    <div className="mx-3 my-2 pb-2 h-[calc(100dvh-259px)] overflow-y-auto rounded-t-lg">
                        <Graph assignments={Object.values(grades.assignments)} />
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}