"use client"

import Link from "next/link"

import { useContext, useState } from "react"

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

export function Navbar() {
    const toggle = useContext(SearchContext)
    const { user, logout } = useContext(AuthContext)

    const points = ["75px", "300px", 1]
    const [snap, setSnap] = useState<number | string | null>(points[0])

    if (useMediaQuery("(min-width: 768px)")) {
        return (
            <div className="relative flex w-screen p-4 z-10">
                <Link href="/" className="my-auto px-4">
                    <Circle strokeWidth={4} />
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
                        <div id="border" className="fixed h-full w-full rounded-t-[10px] border border-b-none">
                            <Drawer.Title />
                            <Drawer.Description />
                            <div className="flex h-[75px]">
                                <Schedule className="ml-[25px]" />
                                <Link href="/" className="my-auto mr-[25px]">
                                    <Circle size={30} strokeWidth={4} />
                                </Link>
                            </div>
                            {user ? (
                                <div>
                                    {user.name}
                                </div>
                            ) : <Auth />}
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        )
    }
}