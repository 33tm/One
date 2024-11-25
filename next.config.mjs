/** @type {import("next").NextConfig} */

export default {
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
        ]
    }
}