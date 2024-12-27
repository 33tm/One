"use client"

import Link from "next/link"

import { useContext, useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"

import { AuthContext } from "@/contexts/AuthContext"
import { SearchContext } from "@/contexts/SearchContext"

import { useMediaQuery } from "@/hooks/useMediaQuery"

import { Auth } from "@/components/Auth"
import { Schedule } from "@/components/Schedule"
import { Button } from "@/components/ui/button"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

import {
    Circle,
    Command,
    LogOut,
    Search,
    User,
    Wrench
} from "lucide-react"
import { Drawer } from "vaul"
import { redirect } from "@/server/redirect"

export function Navbar() {
    const toggle = useContext(SearchContext)
    const { user, loading, logout } = useContext(AuthContext)

    const points = useMemo(() => (loading || user) ? ["75px", "300px"] : ["150px"], [loading, user])
    const [snap, setSnap] = useState<number | string | null>(points[0])

    useEffect(() => {
        setSnap(points[0])
    }, [user, points])

    if (useMediaQuery("(min-width: 768px)")) {
        return (
            <div className="relative flex w-screen p-4 z-10">
                <Link href="/" className="flex my-auto px-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="my-auto"
                    >
                        <Circle strokeWidth={4} />

                    </motion.button>
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Link</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <Link href="/grades" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Grades
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex ml-auto space-x-2">
                    <Link
                        href="https://gunnwatt.web.app"
                        target="_blank"
                        className="pr-2 my-auto transition-opacity ease-in duration-200 hover:opacity-75 hover:cursor-pointer"
                    >
                        <Schedule />
                    </Link>
                    {user ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={toggle}
                            >
                                <Search />
                                Search
                                <kbd className="[&_svg]:size-auto flex gap-1 rounded bg-primary text-background transition-colors duration-200 px-1.5 font-mono">
                                    <Command size={12} />
                                    K
                                </kbd>
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost">
                                        {user.name}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col bg-background space-y-2 p-2 w-44 mr-4 mt-0.5">
                                    <Link href={`/user/${user.id}`}>
                                        <Button variant="ghost" className="flex w-40">
                                            Profile
                                            <User className="ml-auto" />
                                        </Button>
                                    </Link>
                                    <Link href="/settings">
                                        <Button variant="ghost" className="flex w-40">
                                            Settings
                                            <Wrench className="ml-auto" />
                                        </Button>
                                    </Link>
                                    <Button className="flex w-40" onClick={logout}>
                                        Log Out
                                        <LogOut className="ml-auto" />
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </>
                    ) : <Auth />}
                </div>
            </div>
        )
    } else {
        return (
            <Drawer.Root open dismissible={false} modal={false} snapPoints={points} activeSnapPoint={snap} setActiveSnapPoint={setSnap} snapToSequentialPoint>
                <Drawer.Portal>
                    <Drawer.Content className={`fixed flex-col bg-inherit z-50 rounded-t-[10px] bottom-0 left-0 right-0 h-full mx-[-1px] duration-0 ${snap === 1 && "max-h-[97%]"}`}>
                        {/* Dumb workaround for a smooth border color transition */}
                        <div
                            id="border"
                            className="fixed h-full w-full rounded-t-[10px] border border-b-none"
                        >
                            <Drawer.Title />
                            <Drawer.Description />
                            <div
                                className="flex h-[75px]"
                                onClick={() => setSnap(snap === points[0] ? points[1] : points[0])}
                            >
                                <Schedule className="ml-[25px]" />
                                <Link href="/" className="my-auto mr-[25px]">
                                    <Circle size={30} strokeWidth={4} />
                                </Link>
                            </div>
                            {user ? (
                                <div className="flex flex-col h-[225px]">
                                    <div className="flex grow m-4 mt-0 rounded-lg bg-tertiary">
                                        {/* <Link
                                            href="/grades"
                                            onClick={() => alert("adsjlksd")}
                                        > */}
                                        <Button
                                            className="w-full h-full rounded-lg"
                                            onClick={() => {
                                                redirect("/grades")
                                                setSnap(points[0])
                                            }}
                                        >
                                            Grades
                                        </Button>
                                        {/* </Link> */}
                                    </div>
                                    <div className="h-[120px] mt-auto m-4 rounded-lg bg-tertiary">
                                        <div className="flex h-[30px] m-4">
                                            <p className="m-auto text-md font-semibold">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div className="flex w-full mt-auto bg-secondary rounded-lg">
                                            <Button
                                                variant="ghost"
                                                className="w-1/4 h-[60px] rounded-l-lg rounded-r-none bg-secondary brightness-110 text-background"
                                                onClick={() => {
                                                    redirect(`/user/${user.id}`)
                                                    setSnap(points[0])
                                                }}
                                            >
                                                <User />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-1/4 h-[60px] bg-secondary text-background"
                                                onClick={() => {
                                                    redirect("/settings")
                                                    setSnap(points[0])
                                                }}
                                            >
                                                <Wrench />
                                            </Button>
                                            <Button
                                                className="flex w-1/2 h-[60px] rounded-l-none rounded-r-lg"
                                                onClick={() => logout()}
                                            >
                                                <LogOut />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-[75px]">
                                    <Auth className="m-auto h-full w-full text-md rounded-b-none rounded-t-lg" />
                                </div>
                            )}
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        )
    }
}