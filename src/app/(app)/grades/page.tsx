"use client"

import Link from "next/link"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export default function Grades() {
    const { user } = useContext(AuthContext)

    return (
        <>
            <title>
                Grades | Gunn One
            </title>
            <div className="space-x-2">
                {user?.sections.map(section => (
                    <Link key={section.id} href={`/grades/${section.id}`}>
                        {section.name}
                    </Link>
                ))}
            </div>
        </>
    )
}