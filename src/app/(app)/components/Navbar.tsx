"use client"

import { useContext } from "react"
import { UserContext } from "@/contexts/UserContext"

import { DesktopNavbar } from "./DesktopNavbar"

export function Navbar() {
    const user = useContext(UserContext)

    return (
        <>
            <DesktopNavbar {...user} />
        </>
    )
}