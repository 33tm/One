import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function About() {
    return (
        <>
            <div className="flex h-full overflow-y-auto py-10">
                <div className="mx-auto space-y-3 w-[316px]">
                    <div className="p-4 bg-tertiary rounded-lg space-y-2">
                        <p className="text-xl font-bold">About</p>
                        <Separator className="bg-secondary rounded-full" />
                        <p>
                            Source code for the frontend is available on
                            <Link
                                href="https://github.com/33tm/One"
                                className="font-bold ml-1 hover:underline hover:cursor-pointer"
                                target="_blank"
                            >
                                GitHub
                            </Link>
                            .  All contributions are welcome :)
                        </p>
                        <p className="text-xs text-center text-secondary py-2.5">
                            Discord: <strong>33tm</strong>
                            <br />
                            Email: <strong>one (at) tttm (dot) us</strong>
                        </p>
                        <p className="text-xs text-center text-secondary opacity-75">
                            2024-25 · One
                        </p>
                    </div>
                </div>
            </div >
        </>
    )
}