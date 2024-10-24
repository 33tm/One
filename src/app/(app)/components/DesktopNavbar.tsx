import Link from "next/link"

import { useContext } from "react"
import { SearchContext } from "@/contexts/SearchContext"
import type { UserContextType } from "@/contexts/UserContext"

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

import {
    Command,
    LogOut,
    Search,
    User,
    Wrench
} from "lucide-react"
import { Auth } from "@/components/Auth"

export function DesktopNavbar(props: UserContextType) {
    const { user, logout } = props

    return (
        <div className="hidden md:flex w-screen p-4">
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
            <div className="ml-auto space-x-2">
                <Button
                    variant="outline"
                    className="text-muted-foreground"
                    onClick={useContext(SearchContext)}
                >
                    {/* <Search /> */}
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
                ) : <Auth />}
            </div>
        </div>

    )
}