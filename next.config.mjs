/** @type {import("next").NextConfig} */

export default {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: "asset-cdn.schoology.com",
                pathname: "/sites/all/themes/schoology_theme/images/course-default.svg"
            },
            {
                hostname: "asset-cdn.schoology.com",
                pathname: "/system/files/imagecache/card_thumbnail_2x/courselogos/*"
            }
        ],
        unoptimized: true
    },
    devIndicators: {
        appIsrStatus: false
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY"
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin"
                    }
                ]
            }
        ]
    }
}