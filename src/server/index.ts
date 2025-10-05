// Contrary to everything else in this folder, this isn't a server component.
// 2025.10.05 update - Wow I should really rewrite this entire thing

const url = process.env.NODE_ENV === "development"
    ? typeof window !== "undefined"
        ? window.location.origin.replace("3000", "5000")
        : "http://localhost:5000"
    : `${process.env.NEXT_PUBLIC_API_URL}`

export default function server(uri: string, options?: RequestInit) {
    return fetch(`${url}${uri}`, {
        credentials: "include",
        ...options
    })
}

export function websocket(uri: string) {
    return new WebSocket(`${url.replace("http", "ws")}${uri}`)
}