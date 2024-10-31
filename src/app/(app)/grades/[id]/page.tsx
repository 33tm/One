"use client"

import { useContext, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Course() {
    const { id } = useParams<{ id: string }>()
    const { user } = useContext(AuthContext)
    const { grades, error, refreshing, refresh } = useGrades(id)

    const { periods, scales } = grades.data
    const [period, setPeriod] = useState(periods[0])

    console.log(period)

    if (!user) {
        return (
            <></>
        )
    }

    const section = user.sections.find(section => section.id === id)

    if (!section) {
        return (
            <></>
        )
    }

    return (
        <>
            <title>
                {`${section.name} | Grades | Gunn One`}
            </title>
            <div className="flex fixed md:relative bottom-20 md:bottom-0 mx-8">
                <div className="space-y-1">
                    <Link href="/grades" className="flex text-sm text-muted-foreground opacity-75 hover:underline">
                        <ArrowLeft size={13} className="my-auto mr-2" /> All Courses
                    </Link>
                    <div className="text-xl font-extrabold">
                        <h1 className="md:text-3xl">{section.name}</h1>
                        <h1 className="md:text-2xl text-muted-foreground">{section.period} {section.teacher}</h1>
                    </div>
                </div>
                <p className="text-xl md:text-3xl text-muted-foreground font-bold">{period.grade}%</p>
            </div>
            {/* {refreshing && "Refreshing..."}
            {period && period.categories.map(category => (
                <div key={category.id}>
                    <p>{category.name}</p>
                    {category.items.map(item => (
                        <div key={item.id}>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            ))} */}
        </>
    )
}