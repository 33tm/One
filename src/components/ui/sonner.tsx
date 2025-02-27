"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useMediaQuery } from "@/hooks/useMediaQuery"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()
    const desktop = useMediaQuery("(min-width: 768px)")

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="z-40 toaster group mb-[75px] md:mb-0"
            position="bottom-left"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:!bg-primary group-[.toast]:!text-background",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
