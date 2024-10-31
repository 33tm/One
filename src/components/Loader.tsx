import { CgSpinner } from "react-icons/cg"

export function Loader() {
    return (
        <div className="flex fixed top-0 h-screen w-screen -z-10">
            <CgSpinner className="m-auto text-4xl animate-spin" />
        </div>
    )
}