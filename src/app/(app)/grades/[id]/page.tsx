"use client"

import Link from "next/link"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import { DateTime } from "luxon"
import { ArrowLeft } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const { grades, error, refreshing, refresh } = useGrades(id)
    const { periods, scales } = grades.data

    const [period, setPeriod] = useState(periods[0])
    const [category, setCategory] = useState(periods[0]?.categories.sort((a, b) => b.weight - a.weight)[0])

    useEffect(() => {
        setPeriod(periods[0] || null)
        setCategory(periods[0]?.categories.sort((a, b) => b.weight - a.weight)[0] || null)
    }, [periods])

    useEffect(() => {
        if (!user && !loading)
            router.push("/grades")
    }, [user, loading])

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

    if (!period) return <Loader />

    const section = user?.sections.find(section => section.id === id)

    if (!section) return <Error>Invalid state!</Error>

    return (
        <>
            <title>
                {`${section.name} | Grades | Gunn One`}
            </title>
            {refreshing && "Refreshing..."}
            <div className="flex fixed md:relative bottom-48 md:bottom-0 mx-8">
                <div className="space-y-1">
                    <Link href="/grades" className="flex text-sm text-secondary hover:underline">
                        <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                    </Link>
                    <div className="text-xl font-extrabold">
                        <p className="md:text-3xl text-primary">{section.name}</p>
                        <p className="md:text-2xl text-secondary">{section.section}</p>
                    </div>
                </div>
                <p className="text-xl md:text-3xl text-secondary font-bold">{period.grade}%</p>
            </div>
            <div className="flex">
                <div className="m-4 ml-8 w-64 xl:w-80 space-y-2.5">
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
                                                ({c.weight}%)
                                            </p>
                                        </div>
                                        <p className={`font-semibold ${current && "text-tertiary"}`}>
                                            {c.grade && `${c.grade}%`}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className="grow max-h-[calc(100dvh-196px)] m-4 ml-0 rounded-lg space-y-2.5 overflow-y-auto">
                    {category.items
                        .sort((a, b) => b.due - a.due)
                        .map(item => (
                            <div key={item.id} className="flex justify-between rounded-lg bg-tertiary p-4">
                                <div className="flex w-2/3 space-x-2 font-medium">
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
                                <div className="flex font-bold space-x-1 font-mono">
                                    {/* <p>{item.grade}</p> */}
                                    <Input
                                        defaultValue={item.grade}
                                        placeholder="(Ungraded)"
                                        className="text-sm"
                                    />
                                    <p>/</p>
                                    <p>{item.max}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}