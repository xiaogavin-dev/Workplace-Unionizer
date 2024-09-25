"use server"
export default async function apiCall() {
    try {
        let data = await fetch('http://localhost:4000/')

        console.log(data)
    }
    catch (e) {
        console.error("unable to fetch from localhost:\n", e)
    }

}