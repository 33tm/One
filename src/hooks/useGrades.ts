import server from "@/server"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export function useGrades(id: string) {
    const [error, setError] = useState<string>()
    const [refreshing, setRefreshing] = useState(false)
    const [grades, setGrades] = useState<Grades>({
        data: {
            weighted: false,
            periods: [],
            scales: []
        },
        timestamp: Date.now()
    })

    const [open, setOpen] = useState(false)
    const [promise, setPromise] = useState<Promise<Grades>>()

    const refresh = useCallback(() => {
        setRefreshing(true)
        const promise = new Promise<Grades>((resolve, reject) => {
            server(`/sections/${id}/grades`, {
                method: "POST",
                credentials: "include"
            }).then(async res => {
                if (res.status === 200) {
                    const grades = {
                        data: await res.json(),
                        timestamp: Date.now()
                    } satisfies Grades
                    localStorage.setItem(`grades-${id}`, JSON.stringify(grades))
                    resolve(grades)
                } else {
                    const error = await res.text()
                    setError(error)
                    reject(error)
                }
                setRefreshing(false)
            })
        })
        setPromise(promise)
    }, [id])

    useEffect(() => {
        if (!id) return
        const cached = localStorage.getItem(`grades-${id}`)
        if (cached) {
            try {
                const parsed = JSON.parse(cached) satisfies Grades
                const calculated = calculate(parsed)
                if (!validate(parsed, calculated))
                    setError("calc")
                setGrades(calculated)
            } catch {
                localStorage.removeItem(`grades-${id}`)
            }
        }
        refresh()
    }, [id, refresh])

    useEffect(() => {
        if (!promise || open) return
        setOpen(true)
        toast.promise(promise, {
            loading: "Refreshing grades...",
            success: g => {
                function set() {
                    const calculated = calculate(g)
                    setError(validate(g, calculated) ? undefined : "calc")
                    setGrades(calculated)
                }
                let isNew = grades.data.periods.length !== g.data.periods.length
                grades.data.periods.forEach(period => {
                    const p = g.data.periods.find(p => p.id === period.id)
                    if (!p || period.grade !== p.grade || period.categories.length !== p.categories.length)
                        return isNew = true
                    period.categories.forEach(category => {
                        const c = p.categories.find(c => c.id === category.id)
                        if (!c || category.grade !== c.grade || category.items.length !== c.items.length)
                            return isNew = true
                        category.items.forEach(item => {
                            const i = c.items.find(i => i.id === item.id)
                            if (!i || item.grade !== i.grade)
                                return isNew = true
                        })
                    })
                })
                if (error || !grades.data.periods.length) {
                    set()
                    return isNew ? "Fetched new grades." : "No new grades were found."
                } else if (isNew) {
                    toast("New grades available!", {
                        action: {
                            label: "Update",
                            onClick: () => {
                                toast.dismiss()
                                set()
                            }
                        },
                        duration: Infinity
                    })
                    return "Fetched new grades."
                } else {
                    return "No new grades were found."
                }
            },
            error: () => "Failed to refresh grades!"
        })
    }, [promise, open, error, grades])

    function drop(period: string, category: number, assignment: number) {
        const temp = { ...grades }
        const item = temp.data.periods.find(p => p.id === period)!
            .categories.find(c => c.id === category)!
            .items.find(a => a.id === assignment)!
        item.drop = !item.drop
        setGrades(calculate(temp))
    }

    function modify(period: string, category: number, assignment: number, grade: number | null) {
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
        drop,
        refresh,
        refreshing
    }
}

function calculate(grades: Grades) {
    const round = (grade: number) => Math.round((grade + Number.EPSILON) * 100) / 100
    // console.clear()
    grades.data.periods.forEach(period => {
        const [numerator, denominator] = period.categories.reduce(([numerator, denominator], category) => {
            const [points, total] = category.items.reduce(([points, total], item) => {
                // if (category.name === "Quizzes") {
                //     console.log(item.name.slice(0, 10), item.grade, item.max, item.drop)
                // }
                if (item.drop) return [points + item.max, total + item.max]
                const grade = item.custom === null ? item.grade : item.custom
                if (!grade && grade !== 0) return [points, total]
                return [points + grade, total + item.max]
            }, [0, 0])
            const calculated = round(points / total * 100)
            category.calculated = isNaN(calculated) ? null : calculated
            return [numerator + points, denominator + total]
        }, [0, 0])
        if (grades.data.weighted) {
            let total = 0
            const grade = period.categories.reduce((current, category) => {
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
    return grades.data.periods.every((period, i) => {
        const p = calculated.data.periods[i]
        console.log(period.grade, p.calculated)
        if (period.grade !== p.calculated)
            return false
        return period.categories.every((category, j) =>
            category.calculated === p.categories[j].calculated)
    })
}

interface Grades {
    data: {
        weighted: boolean
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
                    drop: boolean
                    grade: number
                    custom: number | null
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