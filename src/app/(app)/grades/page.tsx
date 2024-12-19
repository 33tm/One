"use client"

import Link from "next/link"
import Image from "next/image"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

import { Auth } from "@/components/Auth"

export default function Grades() {
    const { user } = useContext(AuthContext)

    return (
        <>
            <title>
                Grades | One
            </title>
            {user ? (
                <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                    <div className="m-4 md:m-8 md:mt-2 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
                        {user?.sections.map((section) => (
                            <Link key={section.id} href={`/grades/${section.id}`}>
                                <div className="relative group text-center text-lg py-8 rounded-xl hover:scale-105 hover:shadow-2xl transition ease-out duration-200">
                                    <p className="font-bold truncate px-8">{section.name}</p>
                                    <p className="truncate px-8">{section.section}</p>
                                    <Image
                                        fill
                                        priority
                                        sizes="170px"
                                        src={section.image}
                                        alt={section.name}
                                        className="-z-10 rounded-xl object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-200"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex fixed top-0 -z-10 w-screen h-screen outline-dashed">
                    <div className="text-xl font-bold">
                        <h1 className="font-bold text-xl">Grades</h1>
                        <Auth variant="link" className="text-md underline hover:opacity-75" />
                    </div>
                    <div className="m-auto">
                    </div>
                </div>
            )}
        </>
    )
}