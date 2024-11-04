"use client"

import Link from "next/link"

import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

import { ArrowLeft } from "lucide-react"
import { Loader } from "@/components/Loader"
import { Error } from "@/components/Error"

export default function Course() {
    const { id } = useParams<{ id: string }>()
    const { user } = useContext(AuthContext)
    const { grades, error, refreshing, refresh } = useGrades(id)
    const { periods, scales } = grades.data

    const [period, setPeriod] = useState(periods[0])

    useEffect(() => setPeriod(periods[0] || null), [periods])

    if (!user) {
        return (
            <>no user</>
        )
    }

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

    const section = user.sections.find(section => section.id === id)

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
            {period && period.categories.map(category => (
                <div key={category.id}>
                    <p>{category.name}</p>
                    {category.items.map(item => (
                        <div key={item.id}>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}