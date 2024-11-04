/** @type {import("next").NextConfig} */

export default {
    images: {
        remotePatterns: [
            {
                hostname: "asset-cdn.schoology.com",
            },
            {
                hostname: "api.schoology.com",
            }
        ]
    }
}