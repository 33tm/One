"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"

import Error from "@/components/Error"

export default () => {
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        if (!id) return
        localStorage.removeItem(`grades-${id}`)
    }, [id])

    return (
        <Error>
            An error occurred!
        </Error>
    )
}