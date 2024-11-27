import { TriangleAlert } from "lucide-react"

export function Error({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="fixed flex flex-col top-0 h-dvh w-screen">
            <div className="m-auto space-y-4 text-center text-secondary">
                <TriangleAlert size={32} className="m-auto" />
                <div>{children}</div>
            </div>
        </div>
    )
}