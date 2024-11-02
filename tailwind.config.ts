import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)"
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)"
                },
                tirtiary: "var(--tirtiary)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)"
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)"
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)"
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)"
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)"
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))"
                }
            },
            fontFamily: {
                sans: "var(--font-geist-sans)",
                mono: "var(--font-geist-mono)"
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            }
        }
    },
    plugins: [animate]
} satisfies Config