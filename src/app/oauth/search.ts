"use server"

export async function search(query: string) {
    const schools = await fetch(`https://app.schoology.com/register/ajax/school?jq=${query}`)
        .then(res => res.json())

    console.log(schools)
}