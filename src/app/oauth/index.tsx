"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { search, type School } from "@/server/search"
import { redirect } from "@/server/redirect"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Circle } from "lucide-react"
import { CgSpinner } from "react-icons/cg"

export function OAuth({ token, origin, pausd }: { token: string, origin: string, pausd: boolean }) {
    const [query, setQuery] = useState("")
    const [schools, setSchools] = useState<School[]>()
    const [school, setSchool] = useState<School | null>(null)
    const [redirecting, setRedirecting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [pausdLogin, setPausdLogin] = useState(false)
    const searchBox = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const close = ({ key }: { key: string }) => key === "Escape" && setOpen(false)

        window.addEventListener("keydown", close)

        return () => window.removeEventListener("keydown", close)
    }, [open])

    useEffect(() => {
        if (query.length < 3)
            return setSchools(undefined)
        setLoading(true)
        const timeout = setTimeout(() => {
            search(query)
                .then(setSchools)
                .then(() => setLoading(false))
        }, 200)
        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        if (!schools?.find(s => s.id === school?.id))
            setSchool(null)
    }, [schools, school?.id])

    useEffect(() => {
        if (!open || !searchBox.current) return
        searchBox.current.focus()
    }, [open])

    function oauth(domain: string) {
        const url = `${origin}/callback?domain=${encodeURIComponent(`https://${domain}`)}`

        // Schoology blocks any ipv4 address or anything that contains "localhost" from being a valid oauth_callback for whatever reason
        // (Love how this wouldn't be a problem if we just tested in production !!)

        // To account for this very fun fact I put up a route handler at https://tttm.us/redirect,
        // which accepts a "url" query parameter in base64 and redirects to the decoded url :>>

        // Yeah I agree Schoology is pretty great

        // In a development environment, the callback will be set to the aforementioned handler; otherwise, it will redirect to /callback.
        // Previously (up until e57e882) the NEXT_PUBLIC_CALLBACK_URL variable was used, but it was removed since it didn't work across domains.

        const callback = process.env.NODE_ENV === "development"
            ? `tttm.us/redirect?url=${Buffer.from(`http://${url}`).toString("base64")}`
            : url

        const params = new URLSearchParams({
            oauth_token: token,
            oauth_callback: callback
        })

        return `https://${domain}/oauth/authorize?${params}`
    }

    if (pausd) {
        // Maybe this isn't a great thing to do without prompting the user ...
        // Could target advertisements to non PAUSD users who doesn't love those
        // redirect(oauth("pausd.schoology.com"))
        // return <></>
    }

    return (
        <div className="overflow-hidden">
            <div className={`absolute w-screen transition-opacity duration-200 opacity-0 ${open && "opacity-100"}`}>
                <div className="flex px-4 pt-4 pb-2">
                    {open ? (
                        <>
                            <Button
                                variant="secondary"
                                className="rounded-r-none"
                                onClick={() => open && setOpen(false)}
                            >
                                <ChevronLeft />
                            </Button>
                            <Input
                                ref={searchBox}
                                className="text-lg rounded-none"
                                placeholder="Search"
                                defaultValue={query}
                                onChange={({ target }) => setQuery(target.value)}
                            />
                            <Button
                                className="rounded-l-none"
                                disabled={!school || loading || redirecting}
                                onClick={() => {
                                    setRedirecting(true)
                                    redirect(oauth(school?.domain || "app.schoology.com"))
                                }}
                            >
                                Open
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                disabled
                                variant="secondary"
                                className="rounded-r-none"
                            >
                                <ChevronLeft />
                            </Button>
                            <Input
                                disabled
                                className="text-lg rounded-none"
                                placeholder="Search"
                                defaultValue={query}
                            />
                            <Button disabled className="rounded-l-none">
                                Open
                            </Button>
                        </>
                    )}
                </div>
                <div className="h-[calc(100dvh-64px)] p-4 pt-2 space-y-2 overflow-y-auto overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        {!loading && schools && schools[0] && schools[0].title !== "No Schools Found" ? (
                            schools
                                .filter(({ id }) => id !== 2573996462)
                                .map(s => (
                                    <motion.button
                                        key={s.id + s.title}
                                        className={`p-3 w-full text-left rounded-lg font-bold md:hover:shadow-2xl md:transition-shadow transition-colors duration-200 ${((s.id === school?.id || s.location === school?.location) && (s.domain === school?.domain && s.domain !== "app.schoology.com")) ? "bg-primary text-tertiary" : "bg-tertiary"}`}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 300, damping: 15 }
                                        }}
                                        whileTap={{
                                            scale: 0.95,
                                            transition: { type: "spring", stiffness: 300, damping: 15 }
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setSchool(s)}
                                    >
                                        <p className="text-xl truncate">{s.title}</p>
                                        <p className="text-secondary truncate">{s.location}</p>
                                        <p className="text-secondary truncate">{s.domain || "app.schoology.com"}</p>
                                    </motion.button>
                                ))
                        ) : (
                            <motion.div
                                className="flex h-1/2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AnimatePresence mode="wait">
                                    {query.length < 3 ? (
                                        <motion.div
                                            key="0"
                                            className="m-auto text-secondary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            Enter at least 3 characters to search.
                                        </motion.div>
                                    ) : loading ? (
                                        <motion.div
                                            key="1"
                                            className="m-auto"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CgSpinner className="h-8 w-8 m-auto animate-spin" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="2"
                                            className="m-auto text-secondary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            No schools found!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <motion.div
                className="flex h-[50dvh]"
                initial={{ y: "-100%" }}
                animate={{ y: open ? "-100%" : 0 }}
                exit={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                <Circle
                    size={32}
                    strokeWidth={4}
                    className="m-auto"
                />
            </motion.div>
            <motion.div
                className="h-[50dvh]"
                initial={{ y: "100%" }}
                animate={{ y: open ? "100%" : 0 }}
                exit={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                <div className="absolute bottom-0 w-screen">
                    <div
                        className="flex h-[22dvh] bg-tertiary text-lg font-semibold rounded-t-2xl hover:cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <p className="m-auto">
                            Find My School
                        </p>
                    </div>
                    <div className="flex flex-col bg-tertiary h-[6dvh]">
                        <div className="flex justify-between h-[100px] bg-background rounded-t-2xl">
                            <Separator className="my-auto w-[40vw]" />
                            <p className="my-auto text-secondary font-bold">OR</p>
                            <Separator className="my-auto w-[40vw]" />
                        </div>
                    </div>
                    <motion.button
                        onClick={() => {
                            setPausdLogin(true)
                            redirect(oauth("pausd.schoology.com"))
                        }}
                        className={`flex h-[22dvh] w-full bg-primary text-lg font-bold text-tertiary ${pausdLogin || "rounded-t-2xl"}`}
                        animate={{ height: pausdLogin ? "100dvh" : "22dvh" }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <div className="m-auto">
                            {pausdLogin
                                ? <CgSpinner className="h-8 w-8 m-auto text-background animate-spin" />
                                : "PAUSD Login"}
                        </div>
                    </motion.button>
                </div>
            </motion.div>
            <motion.div
                className="-z-10 absolute bottom-0 w-screen h-[11dvh] bg-primary rounded-t-2xl"
                initial={{ y: "100%" }}
                animate={{ y: open ? "100%" : 0 }}
                exit={{ y: 0 }}
            />
        </div >
    )
}