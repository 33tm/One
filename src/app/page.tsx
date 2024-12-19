import Link from "next/link"
import { ArrowRight, Circle } from "lucide-react"

export default function Home() {
    return (
        <div className="flex w-screen h-dvh">
            <div className="m-auto text-center">
                <p className="font-mono text-secondary">Welcome to</p>
                <div className="flex text-4xl space-x-2">
                    <p className="font-bold">One</p>
                    <p className="font-light font-mono text-secondary">/</p>
                    <Circle
                        strokeWidth={4}
                        size={28}
                        className="h-full my-auto text-secondary"
                    />
                </div>
            </div>
            <Link
                href="/setup"
                className="absolute hover:pointer hover:animate-pulse bottom-1/4 left-1/2 -translate-x-1/2"
            >
                <ArrowRight
                    size={24}
                    className="text-secondary"
                />
            </Link>
        </div>
    )
}