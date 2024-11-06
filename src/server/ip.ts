"use server"

import { headers } from "next/headers"

export const ip = async () => (await headers()).get("x-forwarded-for")