"use client"

import { createContext, useEffect, useState } from "react"

import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "@/components/ui/command"

export const SearchContext = createContext<() => void>(() => { })

export const SearchProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        function event(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                setOpen(open => !open)
            }
        }
        document.addEventListener("keydown", event)
        return () => document.removeEventListener("keydown", event)
    }, [])

    return (
        <SearchContext.Provider value={() => setOpen(open => !open)}>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search" />
                <CommandList className="mb-1">
                    <CommandEmpty>No results found!</CommandEmpty>
                    <CommandGroup heading="Communities">
                        <CommandItem>Chemistry Honors</CommandItem>
                        <CommandItem>Analysis Honors</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            {children}
        </SearchContext.Provider>
    )
}