"use client"
import { FC } from 'react'
import { useEffect } from 'react'
import { useAppSelector } from '@/lib/redux/hooks/redux'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Chat from '@/components/chat/chat'
import Layout from '@/components/Layout'
import { SocketProvider } from '@/components/socket/SocketProvider'



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
        if (!user) {
            // router.push('/auth/login')
        }
    }, [])
    return (
        <Layout>
            <SocketProvider>
                <Chat />
            </SocketProvider>
        </Layout>
    )
}

export default page