"use server"
interface Unions {
    id: string,
    unionName: string
}
export default async function getUnions(): Promise<Unions[] | undefined> {
    try {
        const response = await fetch('http://localhost:4000/union/getUnions')
        if (!response.ok) {
            throw new Error('Response error')
        }

        const data: Unions[] = await response.json()
        console.log(data)
        return data
    }
    catch (error: any) {
        console.error("There was an error fetching getUnions: \n", error.message)
        return []
    }
}