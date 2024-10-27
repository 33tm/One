"use client"

import { useContext } from "react"
import { useParams } from "next/navigation"
import { useGrades } from "@/hooks/useGrades"

import { AuthContext } from "@/contexts/AuthContext"

export default function Course() {
    const { id } = useParams<{ id: string }>()
    const { user } = useContext(AuthContext)
    const { grades, error } = useGrades(id)

    console.log(grades)

    return (
        <p>
        </p>
    )
}