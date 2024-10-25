import { useState, useEffect } from "react"

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        const listener = () => setMatches(media.matches)
        if (media.matches !== matches) listener()
        window.addEventListener("resize", listener)
        return () => window.removeEventListener("resize", listener)
    }, [matches, query])

    return matches
}