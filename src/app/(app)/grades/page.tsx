"use client"

import Link from "next/link"
import Image from "next/image"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

import { Auth } from "@/components/Auth"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function Grades() {
    const { user } = useContext(AuthContext)
    const desktop = useMediaQuery("(min-width: 768px)")

    return (
        <>
            <title>
                Grades | Gunn One
            </title>
            {user ? (
                <div className="mb-24 md:mb-0 md:p-24 mx-3 md:mx-0 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
                    <div className="md:hidden flex h-[50vh]">
                        <p className="m-auto text-xl font-semibold">Grades</p>
                    </div>
                    {user?.sections.map((section) => (
                        <Link key={section.id} href={`/grades/${section.id}`}>
                            <div className="relative group text-center text-lg py-8 rounded-xl md:hover:scale-105 md:hover:shadow-2xl transition ease-out duration-200">
                                <p className="font-bold">{section.name}</p>
                                <p>{section.section}</p>
                                <Image
                                    fill
                                    priority
                                    sizes="170px"
                                    src={section.image}
                                    alt={section.name}
                                    className="-z-10 rounded-xl object-cover opacity-20 md:group-hover:opacity-40 transition-opacity duration-200"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex fixed top-0 -z-10 w-screen h-screen outline-dashed">
                    <div className="text-xl font-bold">
                        <h1 className="font-bold text-xl">Grade Calculator</h1>
                        <Auth variant="link" className="text-md underline hover:opacity-75" />
                    </div>
                    <div className="m-auto">
                    </div>
                </div>
            )}
        </>
    )
}