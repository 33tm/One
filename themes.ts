export interface Theme {
    name: string
    background: string
    primary: string
    secondary: string
    tertiary: string
}

export const themes = [
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
    },
    {
        name: "Graphite",
        background: "#222020",
        primary: "#D0CCCA",
        secondary: "#8A8482",
        tertiary: "#4A4644"
    },
    {
        name: "Slate",
        background: "#E8EAEE",
        primary: "#383E4A",
        secondary: "#687080",
        tertiary: "#B4B8C2"
    },
    // Like this one... but removed to make 4x3 grid
    // {
    //     name: "Cherry",
    //     background: "#FFF6F8",
    //     primary: "#7A4058",
    //     secondary: "#A87890",
    //     tertiary: "#EAD0DA"
    // },
    {
        name: "Iris",
        background: "#F0EFF5",
        primary: "#3E3C5C",
        secondary: "#8987AB",
        tertiary: "#C8C7D8"
    },
    {
        name: "Mauve",
        background: "#F4ECF0",
        primary: "#6E4460",
        secondary: "#9C7490",
        tertiary: "#D2BCC8"
    }
] satisfies Theme[]