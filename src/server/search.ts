"use server"

export interface School {
    id: number
    title: string
    location: string
    login_type: string
    use_browser_login_flow: number
    domain?: string
    login_url?: string
    login_url_suggest?: string
}

export async function search(query: string) {
    return await fetch(`https://app.schoology.com/register/ajax/school?jq=${query}&limit=10`)
        .then(res => res.json())
        .then(schools => schools as School[])
}