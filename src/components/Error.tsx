import { TriangleAlert } from "lucide-react"

export function Error({ children, title }: Readonly<{ children: React.ReactNode, title?: string }>) {
    return (
        <>
            {title && <title>{title}</title>}
            <div className="fixed flex flex-col top-0 h-dvh w-screen">
                <div className="m-auto space-y-4 text-center text-secondary">
                    <TriangleAlert size={32} className="m-auto" />
                    <div>{children}</div>
                </div>
            </div>
        </>
    )
}