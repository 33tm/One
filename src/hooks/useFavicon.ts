import { useEffect, useRef } from "react"

export function useFavicon() {
    const favicon = useRef<HTMLLinkElement | null>(null)

    useEffect(() => {
        favicon.current = document.querySelector("link[rel='icon']")
    }, [])

    return favicon.current
}