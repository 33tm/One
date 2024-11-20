import server from "@/server"

import { useState, useEffect, useCallback } from "react"

export function useGrades(id: string) {
    const [error, setError] = useState<string>()
    const [refreshing, setRefreshing] = useState(false)
    const [grades, setGrades] = useState<Grades>({
        data: {
            periods: [],
            scales: []
        },
        timestamp: Date.now()
    })

    const refresh = useCallback(() => {
        setRefreshing(true)
        server(`/sections/${id}/grades`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (res.status === 200) {
                const grades = {
                    data: await res.json(),
                    timestamp: Date.now()
                } satisfies Grades
                setGrades(grades)
                localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
            } else {
                setError(await res.text())
            }
            setRefreshing(false)
        })
    }, [id])

    useEffect(() => {
        const cached = localStorage.getItem(`grades-${id}`)
        if (cached) {
            try {
                const parsed = JSON.parse(cached) satisfies Grades
                // TODO: Invalidate parsed if grades schema ever changes
                setGrades(parsed)
            } catch {
                localStorage.removeItem(`grades-${id}`)
            }
        }
        refresh()
    }, [id, refresh])

    return { grades, error, refreshing, refresh }
}

interface Grades {
    data: {
        periods: {
            id: string
            name: string
            grade: number
            scale: string
            categories: {
                id: number
                name: string
                weight: number
                grade: number
                items: {
                    id: number
                    name: string
                    due: number
                    url: string
                    grade: number
                    max: number
                    scale: number
                }[]
            }[]
        }[]
        scales: {
            id: number
            name: string
            type: number
            average: boolean
            numeric: boolean
            scale: {
                grade: string
                ceiling: number
            }[]
        }[]
    }
    timestamp: number
}