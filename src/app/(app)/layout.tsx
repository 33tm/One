import { AuthProvider } from "@/contexts/AuthContext"
import { SearchProvider } from "@/contexts/SearchContext"

import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <SearchProvider>
                <Navbar />
                <div className="h-[calc(100dvh-72px)] w-screen">
                    {children}
                </div>
                <Toaster />
            </SearchProvider>
        </AuthProvider>
    )
}