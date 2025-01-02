import server from "@/server"

import { useState, useEffect, useCallback, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

export function round(grade: number) {
    const rounded = Math.round((grade + Number.EPSILON) * 100) / 100
    if (rounded > 9999)
        return Infinity
    else if (rounded < -9999)
        return -Infinity
    return rounded
}

const defaultGrades = {
    weighted: false,
    periods: {},
    assignments: {},
    scales: {},
    timestamp: 0
} satisfies Grades

export function useGrades(id: string) {
    const [error, setError] = useState<string>()
    const [refreshing, setRefreshing] = useState(false)
    const [promise, setPromise] = useState<Promise<void>>()
    const [grades, setGrades] = useState<Grades>(defaultGrades)
    const [copy, setCopy] = useState<Grades>(defaultGrades)

    const { user } = useContext(AuthContext)
    const section = user?.sections.find(section => section.id === id)
    const production = process.env.NODE_ENV === "production"

    const refresh = useCallback(() => {
        setRefreshing(true)
        const promise = server(`/sections/${id}/grades`, { method: "POST" })
            .then(async res => {
                setRefreshing(false)
                if (res.status !== 200) {
                    const error = await res.text()
                    setError(error)
                    return
                }

                const grades = await res.json() as Grades
                const calculated = calculate(grades)

                setGrades(calculated)
                setCopy(calculated)

                if (validate(grades, calculated)) {
                    localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
                    setError(undefined)
                } else {
                    localStorage.removeItem(`grades-${id}`)
                    setError("calc")

                    // Attempt to calculate unpublished assignments
                    // Only functional for one unpublished assignment per category
                    // Just don't question why Schoology calculates grades with unpublished assignments
                    const assignments = Object.values(grades.assignments)

                    // Arguably this a terrible way to do it
                    // Uh rewrite someday I guess :'D
                    const g = structuredClone(grades)
                    Object.values(g.periods).forEach(period => {
                        Object.values(period.categories).forEach(category => {
                            const unpublished = assignments
                                .filter(item => item.category === category.id && !item.publish)

                            if (unpublished.length !== 1) return

                            const item = g.assignments[unpublished[0].id]
                            item.publish = true
                            item.drop = false

                            const target = grades.periods[period.id].grade

                            while (Math.abs(target - g.periods[period.id].calculated) < 0.05) {
                                item.grade = Math.round((item.grade + 0.1) * 100) / 100
                                const calculated = calculate(g)
                                if (validate(grades, calculated)) {
                                    setGrades(calculated)
                                    setCopy(calculated)
                                    localStorage.setItem(`grades-${id}`, JSON.stringify(g))
                                    setError(undefined)
                                    break
                                }
                            }
                        })
                    })
                }
            })
            .catch(() => setError("An error occurred!"))
        setPromise(promise)
    }, [id])

    useEffect(() => {
        if (!id) return
        const grades = JSON.parse(localStorage.getItem(`grades-${id}`)!) as Grades | null
        if (grades) {
            const calculated = calculate(grades)
            if (validate(grades, calculated)) {
                setGrades(calculated)
                setCopy(calculated)
            } else {
                setError("calc")
            }
            // Refresh if grades are older than 10 minutes,
            // 1 minute in development
            if (grades.timestamp < Date.now() - (production ? 1000 * 60 * 10 : 1000 * 60))
                refresh()
        } else {
            localStorage.removeItem(`grades-${id}`)
            refresh()
        }
    }, [id, production, refresh])

    useEffect(() => {
        if (!promise || !section) return
        toast.promise(promise, {
            loading: "Fetching grades...",
            success: "Fetched grades!",
            error: "Failed to fetch grades!",
            description: section.name,
            duration: 500
        })
    }, [promise, section])

    function drop(assignment: string) {
        setGrades(g => {
            const grades = { ...g }
            const item = grades.assignments[assignment]
            item.drop = !item.drop
            if (item.new)
                delete grades.assignments[assignment]
            return calculate(grades)
        })
    }

    function modify(assignment: string, value: number | null, type: "grade" | "max") {
        setGrades(g => {
            const grades = { ...g }
            if (type === "grade") grades.assignments[assignment].custom = value
            else grades.assignments[assignment].max = value || 0
            return calculate(grades)
        })
    }

    function weight(assignment: string) {
        const { period } = grades.assignments[assignment]
        const original = grades.periods[period].calculated
        const calculated = calculate({
            ...grades,
            assignments: {
                ...grades.assignments,
                [assignment]: {
                    ...grades.assignments[assignment],
                    drop: true
                }
            }
        })
        const modified = calculated.periods[period].calculated
        return round(original - modified)
    }

    function create(period: string, category: string) {
        let id
        do id = Math.random().toString(36).substring(2)
        while (grades.assignments[id])

        setGrades(g => {
            const grades = { ...g }
            grades.assignments[id] = {
                id,
                name: "Custom Assignment",
                category,
                period,
                due: Date.now(),
                updated: Date.now(),
                url: null,
                drop: false,
                publish: false,
                grade: 0,
                custom: 0,
                max: 10,
                weight: 1,
                scale: "0",
                new: true
            }
            return calculate(grades)
        })
    }

    return {
        copy,
        grades,
        error,
        modify,
        drop,
        weight,
        create,
        refresh,
        refreshing
    }
}

export function calculate(grades: Grades) {
    grades = structuredClone(grades)

    const periods = Object.values(grades.periods)

    periods.forEach(period => {
        const categories = Object.values(period.categories)

        const [
            totalPoints,
            totalTotal,
            totalPercentage,
            totalCount
        ] = categories.reduce(([totalPoints, totalTotal, totalPercentage, totalCount], category) => {
            const items = Object
                .values(grades.assignments)
                .filter(item => item.period === period.id && item.category === category.id)

            const [
                points,
                total,
                percentage,
                count
            ] = items.reduce(([points, total, percentage, count], item) => {
                const grade = item.custom === null ? item.grade : item.custom
                if (item.drop || (!grade && grade !== 0))
                    return [points, total, percentage, count]
                return [
                    points + grade * item.weight,
                    total + item.max * item.weight,
                    percentage + (grade / item.max) * item.weight,
                    count + item.weight
                ]
            }, [0, 0, 0, 0])

            // Determine if the category is calculated by average or points
            // Thank you Schoology for not providing this information
            // Checks and prefers points first since it's the default

            const unroundedAverage = percentage / count * 100
            const roundedAverage = round(unroundedAverage) || null
            const unroundedtotalPoints = points / total * 100
            const roundedTotalPoints = round(unroundedtotalPoints) || null

            // Two different calculation methods yet Schoology API doesn't provide this information
            // If you have 100% in a category, it's calculated by average percentage even if it may not be such a category.

            if (category.calculation === "points"
                || (!category.calculation && category.grade === roundedTotalPoints)) {
                category.calculation = "points"
                category.calculated = roundedTotalPoints
                category.unrounded = unroundedtotalPoints || null
            } else if (category.calculation === "average"
                || (!category.calculation && category.grade === roundedAverage)) {
                category.calculation = "average"
                category.calculated = roundedAverage
                category.unrounded = unroundedAverage || null
            } else {
                const pointsDiff = Math.abs(category.grade - (roundedTotalPoints || 0))
                const averageDiff = Math.abs(category.grade - (roundedAverage || 0))
                if (roundedAverage !== null && pointsDiff < averageDiff) {
                    category.calculation = "points"
                    category.calculated = roundedTotalPoints
                    category.unrounded = unroundedtotalPoints
                } else {
                    category.calculation = "average"
                    category.calculated = roundedAverage
                    category.unrounded = unroundedAverage
                }
            }

            return [
                totalPoints + points,
                totalTotal + total,
                totalPercentage + percentage,
                totalCount + count
            ]
        }, [0, 0, 0, 0])

        if (grades.weighted) {
            const [grade, total] = categories.reduce(([grade, total], category) => {
                if (category.unrounded === null) return [grade, total]
                return [grade + category.unrounded * category.weight, total + category.weight]
            }, [0, 0])
            period.calculated = round(grade / total)
        } else {
            // Unweighted grading
            // Period grades are calculated as if they were a giant category
            // This is totally not misleading at all thank you Schoology

            const average = round(totalPercentage / totalCount * 100)
            const points = round(totalPoints / totalTotal * 100)

            // Yes again two different calculation methods yet no information provided from the API
            // There most likely very much is some undocumented endpoint with this information nicely presented

            if (period.calculation === "points"
                || (!period.calculation && period.grade === points)) {
                period.calculation = "points"
                period.calculated = points
            } else if (period.calculation === "average"
                || (!period.calculation && period.grade === average)) {
                period.calculation = "average"
                period.calculated = average
            } else {
                // Hope this doesn't happen ...
                // tbh shouldn't cause it'd would have happened above with the categories
                period.calculated = points
            }
        }

        if (isNaN(period.calculated))
            period.calculated = 100
    })

    return grades
}

function validate(grades: Grades, calculated: Grades) {
    const periods = Object.values(grades.periods)
    return periods.every(period => {
        const p = calculated.periods[period.id]
        // Schoology API's category weights are not precise enough,
        // So we have to set an arbitrary threshold of error we are fine with.
        if (Math.abs(period.grade - p.calculated) > 0.05)
            return false
        return Object.values(period.categories).every(category =>
            category.calculated === p.categories[category.id].calculated)
    })
}

export interface Period {
    id: string
    name: string
    start: number
    end: number
    grade: number
    calculated: number
    calculation: "points" | "average" | null
    scale: number
    categories: { [id: string]: Category }
}

export interface Category {
    id: string
    name: string
    grade: number
    calculated: number | null
    unrounded: number | null
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
    publish: boolean
    grade: number
    custom: number | null
    max: number
    weight: number
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