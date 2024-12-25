import { CgSpinner } from "react-icons/cg"

export default function Loader({ title }: Readonly<{ title?: string }>) {
    return (
        <>
            {title && <title>{title}</title>}
            <div className="flex fixed top-0 h-dvh w-screen -z-10">
                <CgSpinner className="m-auto text-4xl animate-spin" />
            </div>
        </>
    )
}