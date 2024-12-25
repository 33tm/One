import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function useFavicon() {
    const favicon = useRef<HTMLLinkElement | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        favicon.current = document.querySelector("link[rel='icon']")
        const url = localStorage.getItem("favicon")
        if (!favicon.current || !url) return
        favicon.current.href = url
    }, [pathname])

    return favicon.current
}