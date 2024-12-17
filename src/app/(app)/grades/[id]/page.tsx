"use client"

import Link from "next/link"
import Image from "next/image"
import NumberFlow from "@number-flow/react"
import { ArrowLeft } from "lucide-react"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import { Input } from "@/components/ui/input"
import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const {
        grades,
        error,
        modify,
        drop,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refresh,
        refreshing
    } = useGrades(id)

    const [dismiss, setDismiss] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [periodId, setPeriod] = useState<string>()
    const [categoryId, setCategory] = useState<string>()

    const inputs = useRef(new Map<number, HTMLInputElement>())

    useEffect(() => {
        if (!grades.periods) return

        const periods = Object.values(grades.periods)
        if (!periods.length) return
        if (!periodId) setPeriod(periods[0].id)

        const categories = Object
            .values(periods[0].categories)
            .sort((a, b) => b.weight - a.weight)
        if (!categoryId) setCategory(categories[0].id)
    }, [grades, periodId, categoryId])

    useEffect(() => {
        if (!user && !loading)
            router.push("/grades")
    }, [user, loading, router])

    if (!user) return <Error>Invalid user!</Error>

    const section = user.sections.find(section => section.id === id)

    if (!section) return <Error>Invalid state!</Error>

    if (!periodId) return <Loader />

    if (!categoryId) return <Error>No categories found!</Error>

    const period = grades.periods[periodId]
    const categories = Object.values(grades.periods[periodId].categories)
    const assignments = Object.values(grades.assignments)

    if (error && !dismiss) {
        if (error === "calc") {
            return (
                <>
                    <title>
                        {`${section.name} | Gunn One`}
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
                        {`${section.name} | Gunn One`}
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
                {`${section.name} | Gunn One`}
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
                {refreshing && "Refreshing..."}
                {period.calculated && (
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
            <div className="flex my-4">
                <div className="ml-8 mr-4 min-w-64 xl:min-w-80 space-y-2.5">
                    {period && categories
                        .sort((a, b) => b.weight - a.weight)
                        .map(c => {
                            const current = c.id == categoryId
                            return (
                                <div
                                    key={c.id}
                                    className={`flex rounded-lg ${current ? "bg-primary" : "bg-tertiary"} hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition ease-out duration-200`}
                                    onClick={() => setCategory(c.id)}
                                >
                                    <div className="flex justify-between w-full p-4 select-none">
                                        <div className="flex max-w-36 xl:max-w-52 space-x-1.5">
                                            <p className={`truncate ${current && "text-tertiary"}`}>
                                                {c.name}
                                            </p>
                                            {!!c.weight && (
                                                <p className="text-secondary font-medium">
                                                    ({c.weight}%)
                                                </p>
                                            )}
                                        </div>
                                        {c.calculated && (
                                            <NumberFlow
                                                className={`font-semibold ${current && "text-tertiary"}`}
                                                value={c.calculated}
                                                suffix="%"
                                                continuous
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className="grow h-[calc(100dvh-224px)] pr-8 mr-0 rounded-lg space-y-2.5 overflow-y-auto">
                    {assignments
                        .filter(item => item.period === period.id && item.category === categoryId)
                        .map(item => {
                            const id = parseInt(item.id)
                            const custom = item.custom !== item.grade
                            return (
                                <div key={item.id} className="flex justify-between rounded-lg bg-tertiary p-4">
                                    <div className="flex my-auto w-2/3 space-x-2 font-medium">
                                        <Checkbox
                                            className="my-auto mx-2"
                                            checked={!item.drop || item.custom === undefined}
                                            onCheckedChange={() => drop(item.id)}
                                        />
                                        <div className={`${item.drop && "line-through text-secondary"} transition-all duration-200`}>
                                            {item.url ? (
                                                <Link
                                                    href={item.url}
                                                    target="_blank"
                                                    className="hover:underline truncate"
                                                >
                                                    {item.name}
                                                </Link>
                                            ) : (
                                                <p className="hover:cursor-default truncate">{item.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex my-auto">
                                        {custom && (
                                            <Button
                                                className="hover:underline mr-2 h-8 text-sm"
                                                onClick={() => {
                                                    const input = inputs.current.get(id)
                                                    if (!input) return
                                                    input.value = item.grade ? item.grade.toString() : ""
                                                    modify(item.id, item.grade)
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                        <div className="flex w-36 font-bold font-mono space-x-2">
                                            <Input
                                                className="w-20 text-center h-8 text-sm"
                                                defaultValue={item.grade}
                                                placeholder="-"
                                                ref={input => {
                                                    if (input) inputs.current.set(id, input)
                                                    else inputs.current.delete(id)
                                                }}
                                                onChange={({ target }) => {
                                                    const grade = parseFloat(target.value)
                                                    modify(item.id, isNaN(grade) ? null : grade)
                                                }}
                                            />
                                            <div className="flex space-x-2 my-auto">
                                                <p>/</p>
                                                <p>{item.max}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}