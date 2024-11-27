import server from "@/server"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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
                if (!validate(parsed, calculated)) setError("calc")
                setGrades(calculated)
            } catch {
                localStorage.removeItem(`grades-${id}`)
            }
        }
        refresh()
    }, [id, refresh])

    useEffect(() => {
        if (error && validate(grades, calculate(grades)))
            setError(undefined)
    }, [error, grades])

    useEffect(() => {
        if (!promise || open) return
        setOpen(true)
        toast.promise(promise, {
            loading: "Refreshing grades...",
            success: grades => {
                setGrades(grades)
                if (error) {
                    return "Fetched new grades."
                }
                return "No new grades were found."
                console.log(toast)
                toast("New grades available!", {
                    action: {
                        label: "Update",
                        onClick: () => {
                            toast.dismiss()
                            setGrades(grades)
                        }
                    },
                    duration: Infinity
                })
                // setGrades(grades)
                return "Successfully refreshed grades!"
            },
            error: error => error
        })
    }, [promise, open, error])

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
        console.log(period.grade, p.calculated)
        if (period.grade !== p.calculated)
            return false
        return period.categories.every((category, j) =>
            category.calculated === p.categories[j].calculated)
    })
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