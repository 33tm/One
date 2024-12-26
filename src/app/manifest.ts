import type { MetadataRoute } from "next"

export default function Manifest(): MetadataRoute.Manifest {
    return {
        name: "One",
        start_url: "/",
        display: "standalone",
        icons: []
    }
}