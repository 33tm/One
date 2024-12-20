import server from "@/server"

import { useState, useEffect, useCallback } from "react"

function round(grade: number) {
    const rounded = Math.round((grade + Number.EPSILON) * 100) / 100
    if (rounded > 9999)
        return Infinity
    else if (rounded < -9999)
        return -Infinity
    return rounded
}

export function useGrades(id: string) {
    const [error, setError] = useState<string>()
    const [refreshing, setRefreshing] = useState(false)
    const [grades, setGrades] = useState<Grades>({
        weighted: false,
        periods: {},
        assignments: {},
        scales: {},
        timestamp: 0
    })

    const reset = useCallback(() => {
        console.log("reset")
        setRefreshing(true)
        server(`/sections/${id}/grades/reset`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            setRefreshing(false)
            if (res.status !== 200) {
                const error = await res.text()
                setError(error)
                return
            }

            const grades = await res.json()
            const calculated = calculate(grades)

            if (!validate(grades, calculated))
                setError("calc")

            setGrades(calculated)
            localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
        })
    }, [id])

    const refresh = useCallback((timestamp: number) => {
        timestamp = 1733771543
        console.log("refresh")
        setRefreshing(true)
        server(`/sections/${id}/grades/refresh`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ timestamp })
        }).then(async res => {
            if (res.status === 204) {
                setRefreshing(false)
                return
            }

            const updated = await res.json() as Refreshed
            setGrades(g => {
                const grades = {
                    ...g,
                    ...updated,
                    periods: {
                        ...g.periods,
                        ...updated.periods
                    },
                    assignments: {
                        ...g.assignments,
                        ...updated.assignments
                    }
                }
                const calculated = calculate(grades)
                if (!validate(grades, calculated))
                    setError("calc")
                else
                    localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
                return calculated
            })
            setRefreshing(false)
        })
    }, [id])

    useEffect(() => {
        if (!id) return
        const grades = JSON.parse(localStorage.getItem(`grades-${id}`)!)
        if (grades) {
            const calculated = calculate(grades)
            if (!validate(grades, calculated)) {
                setError("calc")
                reset()
            } else if (true || grades.timestamp < Date.now() - 1000 * 60) {
                refresh(grades.timestamp)
            }
            setGrades(calculated)
        } else {
            localStorage.removeItem(`grades-${id}`)
            reset()
        }
    }, [id, reset, refresh])

    function drop(assignment: string) {
        setGrades(g => {
            const grades = { ...g }
            const item = grades.assignments[assignment]
            item.drop = !item.drop
            return calculate(grades)
        })
    }

    function modify(assignment: string, grade: number | null) {
        setGrades(g => {
            const grades = { ...g }
            grades.assignments[assignment].custom = grade
            return calculate(grades)
        })
    }

    function weight(assignment: string) {
        const g = { ...grades }
        const a = g.assignments[assignment]
        const original = g.periods[a.period].calculated
        calculate({
            ...g,
            assignments: {
                ...g.assignments,
                [assignment]: {
                    ...g.assignments[assignment],
                    drop: true
                }
            }
        })
        const modified = g.periods[a.period].calculated
        calculate(g)
        return round(original - modified)
    }

    return {
        grades,
        error,
        modify,
        drop,
        weight,
        reset,
        refresh,
        refreshing
    }
}

function calculate(grades: Grades) {
    const periods = Object.values(grades.periods)

    periods.forEach(period => {
        const categories = Object.values(period.categories)

        const [numerator, denominator] = categories.reduce(([numerator, denominator], category) => {
            const items = Object
                .values(grades.assignments)
                .filter(item => item.period === period.id && item.category === category.id)

            let totalPercent = 0
            let assignments = 0
            const [points, total] = items.reduce(([points, total], item) => {
                const grade = item.custom === null ? item.grade : item.custom
                if (item.drop || (!grade && grade !== 0))
                    return [points, total]
                totalPercent += grade / item.max
                assignments++
                return [points + grade, total + item.max]
            }, [0, 0])

            // Determine if the category is calculated by average or points
            // Thank you Schoology for not providing this information
            const average = round(totalPercent / assignments * 100)
            const totalPoints = round(points / total * 100)
            if (category.calculation === "average"
                || (category.grade !== totalPoints
                    && !category.calculation
                    && category.grade === average)) {
                category.calculation = "average"
                category.calculated = isNaN(average) ? null : average
            } else {
                category.calculation = "points"
                category.calculated = isNaN(totalPoints) ? null : totalPoints
            }

            return [numerator + points, denominator + total]
        }, [0, 0])

        if (grades.weighted) {
            let total = 0
            const grade = categories.reduce((current, category) => {
                const grade = category.calculated
                if (!grade && grade !== 0) return current
                total += category.weight
                return current + grade * category.weight
            }, 0)
            period.calculated = round(grade / total)
        } else {
            // Points based grading
            // Category weights are undefined, period grades are calculated as if it was a giant category
            // This is totally not misleading at all thank you Schoology
            period.calculated = round(numerator / denominator * 100)
        }
    })

    return grades
}

function validate(grades: Grades, calculated: Grades) {
    const periods = Object.values(grades.periods)

    return periods.every(period => {
        const p = calculated.periods[period.id]
        if (period.grade !== p.calculated)
            return false
        return Object.values(period.categories).every(category =>
            category.calculated === p.categories[category.id].calculated)
    })
}

export interface Period {
    id: string
    name: string
    grade: number
    calculated: number
    scale: number
    categories: { [id: string]: Category }
}

export interface Category {
    id: string
    name: string
    grade: number
    calculated: number | null
    weight: number
    calculation: "points" | "average" | null
}

export interface Assignment {
    id: string
    name: string
    category: string
    period: string
    due: number
    updated: number
    url: string | null
    drop: boolean
    grade: number
    custom: number | null
    max: number
    scale: string
    new: boolean
}

export interface Scale {
    id: string
    name: string
    type: number
    average: boolean
    numeric: boolean
    scale: {
        grade: string
        ceiling: number
    }[]
}

export interface Grades {
    weighted: boolean
    periods: { [id: string]: Period }
    assignments: { [id: string]: Assignment }
    scales: { [id: string]: Scale },
    timestamp: number
}

type Refreshed = Omit<Grades, "weighted" | "scales">