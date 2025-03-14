"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

import { useMediaQuery } from "@/hooks/useMediaQuery"

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
    const desktop = useMediaQuery("(min-width: 768px)")
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                desktop || "outline-none border-none data-[state=unchecked]:bg-secondary transition-all duration-200",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn("flex items-center justify-center text-current")}
            >
                <Check className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
