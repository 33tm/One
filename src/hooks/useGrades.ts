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
                if (validate(grades, calculate(grades))) {
                    setGrades(grades)
                    localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
                } else {
                    setError("Unable to calculate grades!")
                }
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
                if (validate(parsed, calculate(parsed))) {
                    setGrades(parsed)
                } else {
                    localStorage.removeItem(`grades-${id}`)
                    setError("Unable to calculate grades!")
                }
            } catch {
                localStorage.removeItem(`grades-${id}`)
            }
        }
        refresh()
    }, [id, refresh])

    function calculate(grades: Grades) {
        grades.data.periods.forEach(period => {
            period.categories.forEach(category => {
                const [points, total] = category.items.reduce(([points, total], item) => {
                    const grade = item.custom === null ? item.grade : item.custom
                    if (!grade && grade !== 0) return [points, total]
                    return [points + grade, total + item.max]
                }, [0, 0])
                const calculated = Math.round(((points / total * 100) + Number.EPSILON) * 100) / 100
                category.calculated = isNaN(calculated) ? null : calculated
            })
            let total = 0
            const grade = period.categories.reduce((current, category) => {
                const grade = category.calculated
                if (!grade && grade !== 0) return current
                const weight = category.weight ?? 100 / period.categories.filter(category => category.items.length).length
                total += weight
                return current + grade * weight
            }, 0)
            period.calculated = Math.round(((grade / total) + Number.EPSILON) * 100) / 100
        })
        return grades
    }

    function validate(grades: Grades, calculated: Grades) {
        return grades.data.periods.every((period, i) => {
            const p = calculated.data.periods[i]
            if (period.grade !== p.calculated)
                return false
            return period.categories.every((category, j) =>
                category.calculated === p.categories[j].calculated)
        })
    }

    function modify(period: string, category: number, assignment: number, grade: number | null | undefined) {
        const temp = { ...grades }
        temp.data.periods.find(p => p.id === period)!
            .categories.find(c => c.id === category)!
            .items.find(a => a.id === assignment)!
            .custom = grade
        setGrades(calculate(temp))
    }

    return {
        grades,
        error,
        modify,
        refresh,
        refreshing
    }
}

interface Grades {
    data: {
        periods: {
            id: string
            name: string
            grade: number
            calculated: number | null
            scale: string
            categories: {
                id: number
                name: string
                weight: number
                grade: number
                calculated: number | null
                items: {
                    id: number
                    name: string
                    due: number
                    url: string
                    grade: number
                    custom: number | null | undefined
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