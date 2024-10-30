import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export function useGrades(id: string) {
    const { user } = useContext(AuthContext)
    const [error, setError] = useState<string>()
    const [grades, setGrades] = useState(getCached())

    function getCached() {
        try {
            const cached = localStorage.getItem(`${id}-grades`)
            if (!cached) return null
            return JSON.parse(cached)
        } catch {
            return null
        }
    }

    function refresh() {
        if (!user) return
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/sections/${id}/grades`, {
            method: "POST",
            credentials: "include"
        }).then(async res => {
            if (res.status === 200) {
                const grades = await res.json()
                setGrades(grades)
                localStorage.setItem(`${id}-grades`, JSON.stringify(grades))
            } else {
                setError("Error")
            }
        })
    }

    useEffect(refresh, [user])

    return { grades, error, refresh }
}