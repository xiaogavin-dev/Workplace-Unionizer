"use client"
import React, { useEffect, useState } from 'react'
import apiCall from './actions'
const page = () => {
    const [url, setUrl] = useState<string>("")
    useEffect(() => {
        apiCall()
    }, [])
    useEffect(() => {
        console.log(url)
    }, [url])
    return (
        <div className=''>
            A request was sent to the backend
        </div>
    )
}

export default page