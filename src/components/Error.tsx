import { TriangleAlert } from "lucide-react"

export function Error({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col fixed top-0 h-dvh w-screen -z-10">
            <div className="m-auto space-y-4 text-center text-secondary">
                <TriangleAlert size={32} className="m-auto" />
                <div>{children}</div>
            </div>
        </div>
    )
}