"use client"

import Link from "next/link"

import { useContext } from "react"

import { AuthContext } from "@/contexts/AuthContext"
import { SearchContext } from "@/contexts/SearchContext"

import { useSchedule } from "@/hooks/useSchedule"
import { useMediaQuery } from "@/hooks/useMediaQuery"

import { AuthButton } from "@/components/AuthButton"
import { Button } from "@/components/ui/button"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer"

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

import {
    Circle,
    Command,
    LogOut,
    MenuIcon,
    Search,
    User,
    Wrench
} from "lucide-react"

export function Navbar() {
    const toggle = useContext(SearchContext)
    const { user, logout } = useContext(AuthContext)

    const desktop = useMediaQuery("(min-width: 768px)")
    const { schedule, status } = useSchedule(user)

    if (desktop) {
        return (
            <div className="flex w-screen p-4">
                <Link href="/" className="my-auto px-4">
                    <Circle strokeWidth={4} />
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
                <div className="flex ml-auto space-x-2">
                    <div className={`m-auto pr-2 text-sm text-muted-foreground transition-opacity ease-in duration-200 ${!status && "opacity-0"}`}>
                        {schedule && (
                            <Link
                                href="https://gunnwatt.web.app"
                                target="_blank"
                                className="flex space-x-1.5 hover:cursor-pointer"
                            >
                                <p className="font-bold">{schedule.period}</p>
                                <p>{schedule.start}-{schedule.end}</p>
                            </Link>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        className="text-muted-foreground"
                        onClick={toggle}
                    >
                        <Search />
                        Search
                        <kbd className="[&_svg]:size-auto flex gap-1 rounded bg-muted px-1.5 font-mono">
                            <Command size={12} />
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
                    ) : <AuthButton />}
                </div>
            </div>
        )
    } else {
        return (
            <div className="fixed flex bottom-0 w-screen p-4">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="ghost" className="w-10">
                            <MenuIcon />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>This action cannot be undone.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button variant="secondary">Submit</Button>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <Link href="/" className="ml-auto my-auto px-4">
                    <Circle strokeWidth={4} />
                </Link>
            </div>
        )
    }
}