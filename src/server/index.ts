// Contrary to everything else in this folder, this isn't a server component.

export default function server(uri: string, options?: RequestInit) {
    const url = process.env.NODE_ENV === "development"
        ? window.location.origin.replace("3000", "443")
        : `${process.env.NEXT_PUBLIC_API_URL}`
    return fetch(`${url}${uri}`, options)
}

export function websocket(uri: string) {
    const url = process.env.NODE_ENV === "development"
        ? window.location.origin.replace("3000", "443")
        : `${process.env.NEXT_PUBLIC_API_URL}`
    return new WebSocket(`${url.replace("http", "ws")}${uri}`)
}