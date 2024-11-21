"use client"

import Link from "next/link"
import NumberFlow from "@number-flow/react"
import { DateTime } from "luxon"
import { ArrowLeft } from "lucide-react"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import { Input } from "@/components/ui/input"
import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"
import { Button } from "@/components/ui/button"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const {
        grades,
        error,
        modify,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refresh,
        refreshing
    } = useGrades(id)

    const { periods } = grades.data

    const [period, setPeriod] = useState(periods[0])
    const [category, setCategory] = useState(periods[0]?.categories.sort((a, b) => b.weight - a.weight)[0])
    const inputs = useRef(new Map<number, HTMLInputElement>())

    useEffect(() => {
        setPeriod(periods[0] || null)
        setCategory(periods[0]?.categories.sort((a, b) => b.weight - a.weight)[0] || null)
    }, [periods])

    useEffect(() => {
        if (!user && !loading)
            router.push("/grades")
    }, [user, loading, router])

    if (error) {
        return (
            <>
                <Link href="/grades" className="flex text-sm text-secondary hover:underline">
                    <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                </Link>
                <Error>{error}</Error>
            </>
        )
    }

    if (!user) return <Error>Invalid user!</Error>

    if (!period) return <Loader />

    const section = user.sections.find(section => section.id === id)

    if (!section) return <Error>Invalid state!</Error>

    return (
        <>
            <title>
                {`${section.name} | Grades | Gunn One`}
            </title>
            <div className="flex md:relative bottom-48 md:bottom-0 px-8">
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
                {period.calculated && (
                    <NumberFlow
                        className="ml-auto mt-auto text-2xl md:text-3xl text-secondary font-bold"
                        value={period.calculated}
                        suffix="%"
                    />
                )}
            </div>
            <div className="flex my-4">
                <div className="ml-8 mr-4 min-w-64 xl:min-w-80 space-y-2.5">
                    {period && period.categories
                        .sort((a, b) => b.weight - a.weight)
                        .map(c => {
                            const current = c.id == category.id
                            return (
                                <div
                                    key={c.id}
                                    className={`flex rounded-lg ${current ? "bg-primary" : "bg-tertiary"} hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition ease-out duration-200`}
                                    onClick={() => setCategory(c)}
                                >
                                    <div className="flex justify-between w-full p-4 select-none">
                                        <div className="flex max-w-36 xl:max-w-52 space-x-1.5">
                                            <p className={`truncate ${current && "text-tertiary"}`}>
                                                {c.name}
                                            </p>
                                            <p className="text-secondary font-medium">
                                                ({c.weight ?? (100 / period.categories.length).toFixed(2)}%)
                                            </p>
                                        </div>
                                        {c.calculated && (
                                            <NumberFlow
                                                className={`font-semibold ${current && "text-tertiary"}`}
                                                value={c.calculated}
                                                suffix="%"
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className="grow max-h-[calc(100dvh-196px)] pr-8 rounded-lg space-y-2.5 overflow-y-auto">
                    {category.items
                        .sort((a, b) => b.due - a.due)
                        .map(item => {
                            const custom = (item.custom === null ? item.grade : item.custom) !== item.grade
                            return (
                                <div key={item.id} className="flex justify-between rounded-lg bg-tertiary p-4">
                                    <div className="flex my-auto w-2/3 space-x-2 font-medium">
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
                                        {item.due && (
                                            <p className="text-secondary">
                                                {DateTime.fromMillis(item.due).toFormat("yyyy.MM.dd")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex my-auto">
                                        {custom && (
                                            <Button
                                                className="hover:underline mr-2 h-8 text-sm"
                                                onClick={() => {
                                                    const input = inputs.current.get(item.id)
                                                    if (!input) return
                                                    input.value = item.grade ? item.grade.toString() : ""
                                                    modify(period.id, category.id, item.id, item.grade)
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
                                                    if (input) inputs.current.set(item.id, input)
                                                    else inputs.current.delete(item.id)
                                                }}
                                                onChange={({ target }) => {
                                                    const grade = parseFloat(target.value)
                                                    modify(period.id, category.id, item.id, isNaN(grade) ? undefined : grade)
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
            {refreshing && "Refreshing..."}
        </>
    )
}