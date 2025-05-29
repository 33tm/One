import { useEffect, useState } from "react"
import { DateTime } from "luxon"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DataControlProps {
    timestamp: number
    refresh: () => void
    refreshing: boolean
    className?: string
}
export default function DataControl(props: DataControlProps) {
    const { timestamp, refresh, refreshing, className } = props
    const [now, setNow] = useState(Date.now())

    const production = process.env.NODE_ENV === "production"

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`flex items-center ${className}`}>
            <Button className="w-52 text-center text-xs rounded-r-none bg-background border text-primary hover:cursor-default">
                Updated {DateTime.fromMillis(timestamp).toRelative()}
            </Button>
            <Button
                onClick={refresh}
                disabled={refreshing || (production && now - timestamp < 1000 * 10)}
                className="w-12 rounded-l-none"
            >
                <RefreshCw className={`${refreshing && "animate-spin"}`} />
            </Button>
        </div >
    )
}