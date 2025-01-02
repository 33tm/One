import type { MetadataRoute } from "next"

export default function Manifest(): MetadataRoute.Manifest {
    return {
        name: "One",
        start_url: "/",
        display: "standalone",
        theme_color: "#171717",
        background_color: "#171717",
        icons: [
            {
                src: "/logo/192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/logo/512.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    }
}