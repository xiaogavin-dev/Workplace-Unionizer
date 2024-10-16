"use client"
import { FC } from 'react'
import { useEffect } from 'react'
import { useAppSelector } from '@/lib/redux/hooks/redux'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Chat from '@/components/chat/chat'




interface pageProps {
    params: {
        chatId: string
    }
}

const page: FC<pageProps> = ({ params }: pageProps) => {
    const { chatId } = params;
    const { user } = useAppSelector(state => state.auth)
    const router = useRouter()
    useEffect(() => {
        console.log(user)
        if (!user) {
            router.push('/auth/login')
        }
    }, [])
    return (
        <>
            <Chat />
        </>
    )
}

export default page