import server from "@/server"

import { useState, useEffect } from "react"

export function useGrades(id: string) {
    const [error, setError] = useState<string>()
    const [grades, setGrades] = useState<Grades>(getCached())
    const [refreshing, setRefreshing] = useState(false)

    function getCached() {
        const defaultGrades = {
            data: {
                periods: [],
                scales: []
            },
            timestamp: 0
        } satisfies Grades
        try {
            const cached = localStorage.getItem(`${id}-grades`)
            if (!cached) return defaultGrades
            return JSON.parse(cached)
        } catch {
            return defaultGrades
        }
    }

    function refresh() {
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
                // localStorage.setItem(`${id}-grades`, JSON.stringify(grades))
            } else {
                setError(await res.text())
            }
            setRefreshing(false)
        })
    }

    useEffect(refresh, [id])

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