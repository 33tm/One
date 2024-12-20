"use client"

import Link from "next/link"
import Image from "next/image"
import NumberFlow from "@number-flow/react"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import Categories from "./layout/Categories"

import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { ArrowLeft } from "lucide-react"
import Assignments from "./layout/Assignments"

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refresh,
        refreshing
    } = useGrades(id)

    const [dismiss, setDismiss] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [periodId, setPeriod] = useState<string>()
    const [category, setCategory] = useState<string>()

    useEffect(() => {
        if (!grades.periods) return

        const periods = Object.values(grades.periods)
        if (!periods.length) return
        if (!periodId) setPeriod(periods[0].id)

        const categories = Object
            .values(periods[0].categories)
            .sort((a, b) => b.weight - a.weight)
        if (!category) setCategory(categories[0].id)
    }, [grades, periodId, category])

    useEffect(() => {
        if (!user && !loading)
            router.push("/grades")
    }, [user, loading, router])


    if (!user) return <Error>Invalid user!</Error>

    const section = user.sections.find(section => section.id === id)

    if (!section) return <Error>Invalid state!</Error>

    const title = `${section.name} | One`

    if (!periodId) return <Loader title={title} />

    if (!category) return <Error title={title}>No categories found!</Error>

    const period = grades.periods[periodId]
    const categories = Object.values(grades.periods[periodId].categories)
    const assignments = Object
        .values(grades.assignments)
        .filter(item => item.period === period.id && item.category === category)

    if (error && !dismiss) {
        if (error === "calc") {
            return (
                <>
                    <title>
                        {`${section.name} | One`}
                    </title>
                    <Error>
                        <Link href="/grades" className="fixed flex left-4 top-28 md:left-8 md:top-20 text-sm text-secondary hover:underline">
                            <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                        </Link>
                        <p className="font-bold mb-4">Failed to calculate grades!</p>
                        <div className="mx-4">
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
                                onClick={() => setDismiss(true)}
                                className="w-full rounded-t-none transition-all duration-200"
                            >
                                {refreshing ? "Refreshing..." : "Ignore"}
                            </Button>
                            <p className="mt-4 text-secondary text-sm font-semibold">
                                Ignoring will make grade calculations innaccurate.
                            </p>
                        </div>
                    </Error>
                </>
            )
        } else {
            return (
                <>
                    <title>
                        {`${section.name} | One`}
                    </title>
                    <Error>
                        <Link href="/grades" className="fixed flex left-4 top-28 md:left-8 md:top-20 text-sm text-secondary hover:underline">
                            <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                        </Link>
                        {error}
                    </Error>
                </>
            )
        }
    }

    return (
        <>
            <title>
                {`${section.name} | One`}
            </title>
            <div
                style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background) 100%)" }}
                className="flex md:relative bottom-48 md:bottom-0 mx-8 mb-4 px-8 py-4 outline outline-2 outline-tertiary rounded-lg"
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
                {!!period.calculated && (
                    <NumberFlow
                        className="text-secondary ml-auto mt-auto text-2xl md:text-3xl font-bold"
                        value={period.calculated}
                        suffix="%"
                        continuous
                    />
                )}
                <Image
                    fill
                    className="-z-10 object-cover opacity-20 rounded-lg"
                    src={section.image}
                    alt={section.name}
                />
            </div>
            <div className="flex mx-8 my-4 h-[calc(100dvh-224px)]">
                <Categories
                    category={category}
                    categories={categories}
                    setCategory={setCategory}
                />
                <Assignments
                    assignments={assignments}
                    drop={drop}
                    modify={modify}
                    weight={weight}
                />
            </div>
        </>
    )
}