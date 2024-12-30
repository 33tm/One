"use client"

import { useContext } from "react"
import { DateTime } from "luxon"

import { AuthContext } from "@/contexts/AuthContext"

import { redirect } from "@/server/redirect"

import Loader from "@/components/Loader"

export default function User() {
    const { user, loading } = useContext(AuthContext)

    if (loading) return <Loader />

    if (!user) return redirect("/")

    return (
        <div className="h-full flex">
            <div className="m-auto">
                <div className="flex space-x-1.5 text-2xl font-bold">
                    <p>{user.name}</p>
                    <p className="my-auto h-fit py-1 px-2 rounded-sm bg-secondary text-sm text-background">#{user.id}</p>
                </div>
                <p className="text-sm">{user.domain.replace(/^https?:\/\//, "")}</p>
                <div className="flex mt-1 space-x-1 text-xs text-background font-bold">
                    {user.pausd && <p className="bg-primary py-1 px-3 rounded-full w-fit">PAUSD</p>}
                    {user.gunn && <p className="bg-primary py-1 px-3 rounded-full w-fit">Gunn {`'${user.class?.toString().slice(2)}`}</p>}
                </div>
            </div>
            <div className="absolute bottom-28 w-full text-center text-xs">
                <p className="mx-auto bg-secondary text-background font-semibold py-1 px-3 rounded-full w-fit">
                    Joined {DateTime.fromISO(user.created).toLocaleString(DateTime.DATETIME_MED)}
                </p>
                <p className="mt-6">Exciting, isn{"'"}t it...</p>
            </div>
            {/* <p className="absolute bottom-28 w-full text-center text-xs"></p> */}
        </div>
    )
}