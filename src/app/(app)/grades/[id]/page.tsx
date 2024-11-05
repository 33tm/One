"use client"

import Link from "next/link"

import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import { ArrowLeft } from "lucide-react"
import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export default function Course() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const { grades, error, refreshing, refresh } = useGrades(id)
    const { periods, scales } = grades.data

    const [period, setPeriod] = useState(periods[0])
    const [category, setCategory] = useState(periods[0]?.categories[0])

    useEffect(() => {
        setPeriod(periods[0] || null)
        setCategory(periods[0]?.categories[0] || null)
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
                <div className="m-4 w-64 xl:w-80 space-y-2.5">
                    {period && period.categories.map(c => {
                        const current = c.id === category.id
                        return (
                            <div
                                key={c.id}
                                className={`flex rounded-lg bg-tirtiary ${current && "bg-current"} hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition ease-out duration-200`}
                                onClick={() => setCategory(c)}
                            >
                                <div className="flex justify-between w-full p-4 select-none">
                                    <div className="flex max-w-36 xl:max-w-52 space-x-1.5">
                                        <p className={`truncate ${current && "text-tirtiary"}`}>
                                            {c.name}
                                        </p>
                                        <p className="text-secondary font-medium">
                                            ({c.weight}%)
                                        </p>
                                    </div>
                                    <p className={`font-semibold ${current && "text-tirtiary"}`}>
                                        {c.grade ? `${c.grade}%` : "-"}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="m-4 ml-0 grow outline-dotted">
                    {category.items.map(item => (
                        <div key={item.id}>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}