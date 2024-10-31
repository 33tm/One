import { useState, useEffect, useContext, useCallback } from "react"
import { AuthContext } from "@/contexts/AuthContext"

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
                    due: string
                    url: string
                    grade: number
                    max: number
                    scale: number
                }[]
            }[]
        }[]
        scales: {
            id: number
            title: string
            type: number
            auto_averaging: number
            hide_numeric: number
            scale: {
                level: {
                    grade: string
                    cutoff: number
                    average: number
                }[]
            }
        }[]
    }
    timestamp: number
}

export function useGrades(id: string) {
    const { user } = useContext(AuthContext)
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
        if (!user) return
        setRefreshing(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/sections/${id}/grades`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (res.status === 200) {
                const grades = {
                    data: await res.json(),
                    timestamp: Date.now()
                } satisfies Grades
                setGrades(grades)
                localStorage.setItem(`${id}-grades`, JSON.stringify(grades))
            } else {
                setError("Error")
            }
            setRefreshing(false)
        })
    }

    useEffect(refresh, [user])

    return { grades, error, refreshing, refresh }
}