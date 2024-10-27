"use client"

import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

import { AuthContext } from "@/contexts/AuthContext"

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
    const { user } = useContext(AuthContext)
    const router = useRouter()

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

    const grades = user?.sections.map(section => (
        <CommandItem
            key={section.id}
            onSelect={() => {
                setOpen(false)
                router.push(`/grades/${section.id}`)
            }}
        >
            {section.name}
        </CommandItem>
    ))

    return (
        <SearchContext.Provider value={() => setOpen(open => !open)}>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search" />
                <CommandList className="mb-1">
                    <CommandEmpty>No results found!</CommandEmpty>
                    {grades && (
                        <CommandGroup heading="Grades">
                            {grades}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
            {children}
        </SearchContext.Provider>
    )
}