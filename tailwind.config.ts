import type { Config } from "tailwindcss"

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)"
            },
            fontFamily: {
                sans: "var(--font-geist-sans)",
                mono: "var(--font-geist-mono)"
            }
        }
    }
} satisfies Config