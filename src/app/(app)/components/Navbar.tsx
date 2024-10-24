"use client"

import Link from "next/link"

import { useContext } from "react"
import { UserContext } from "@/contexts/UserContext"
import { SearchContext } from "@/contexts/SearchContext"

import {
    Command,
    LogOut,
    User,
    Wrench
} from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Auth } from "@/components/Auth"

export function Navbar() {
    const { user, refresh } = useContext(UserContext)

    function logout() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        }).then(refresh)
    }

    return (
        <div className="flex w-screen p-4">
            <Link href="/" className="my-auto pl-3 pr-4">
                <h1 className="font-bold text-lg">Gunn One</h1>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Communities</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <Link href="/grades" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Grade Calculator
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex ml-auto space-x-2 text-muted-foreground">
                <Button variant="outline" onClick={useContext(SearchContext)}>
                    <p>Search</p>
                    <kbd className="flex-end pointer-events-none inline-flex items-center gap-1 rounded bg-muted px-1.5 font-mono">
                        <Command className="" />
                        K
                    </kbd>
                </Button>
                {user ? (
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
                ) : <Auth />}
            </div>
        </div>
    )
}