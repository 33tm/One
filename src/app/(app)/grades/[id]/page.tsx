"use client"

import { useContext } from "react"
import { useParams } from "next/navigation"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

export default function Course() {
    const { id } = useParams<{ id: string }>()
    const { user } = useContext(AuthContext)
    const { grades, error, refresh } = useGrades(id)

    return (
        <>
            <title>
                {`${user?.sections.find(section => section.id === id)?.name} | Grades | Gunn One`}
            </title>
        </>
    )
}