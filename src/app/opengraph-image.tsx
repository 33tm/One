import { readFile } from "fs/promises"
import { ImageResponse } from "next/og"

export const contentType = "image/png"
export const dynamic = "force-dynamic"
export const alt = "One"
export const size = {
    width: 1200,
    height: 630
}

const themes = [
    {
        name: "Dark",
        background: "#171717",
        primary: "#FAFAFA",
        secondary: "#999999",
        tertiary: "#262626"
    },
    {
        name: "Light",
        background: "#F2F2F2",
        primary: "#3A3A3A",
        secondary: "#6E6E6E",
        tertiary: "#BFBFBF"
    },
    {
        name: "Green",
        background: "#E1F0DA",
        primary: "#4F6F52",
        secondary: "#6A946E",
        tertiary: "#B4CAB6"
    },
    {
        name: "Blue",
        background: "#DDE6ED",
        primary: "#526D82",
        secondary: "#6D8BA3",
        tertiary: "#B6C5D1"
    },
    {
        name: "Beige",
        background: "#F3EEEA",
        primary: "#594545",
        secondary: "#756464",
        tertiary: "#C0B0B0"
    },
    {
        name: "Mint",
        background: "#EAF9F3",
        primary: "#4D8076",
        secondary: "#79A69A",
        tertiary: "#CDE5DC"
    },
    {
        name: "Lavender",
        background: "#F6F0FA",
        primary: "#6A5B8E",
        secondary: "#9C88B2",
        tertiary: "#D8C8E3"
    },
    {
        name: "Pink",
        background: "#FFF0F3",
        primary: "#9E4F64",
        secondary: "#C9798F",
        tertiary: "#EBD0D8"
    }
]

export default async function Image() {
    const light = await fetch("https://gunn.one/geist/light.ttf")
        .then(res => res.arrayBuffer())
    const bold = await fetch("https://gunn.one/geist/bold.ttf")
        .then(res => res.arrayBuffer())

    const theme = themes[Math.random() * themes.length | 0]

    return new ImageResponse((
        <div
            tw="flex w-full h-full items-center justify-center"
            style={{ backgroundColor: theme.background }}
        >
            <div tw="absolute flex text-8xl -bottom-8 left-20">
                <p style={{
                    fontFamily: "Geist Bold",
                    color: theme.primary
                }}>
                    One
                </p>
                <p style={{
                    fontFamily: "Geist Light",
                    color: theme.secondary,
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem"
                }}>
                    /
                </p>
                <div tw="flex my-auto">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme.secondary}
                        stroke-width="4"
                    >
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </div>
            </div>
        </div>
    ), {
        ...size,
        fonts: [
            {
                name: "Geist Light",
                data: light,
                style: "normal",
                weight: 400
            },
            {
                name: "Geist Bold",
                data: bold,
                style: "normal",
                weight: 700
            }
        ]
    })

}