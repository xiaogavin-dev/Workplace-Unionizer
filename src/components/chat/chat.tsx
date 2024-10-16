"use client"
import { FC } from 'react'

import io from "socket.io-client"

interface chatProps {

}

const Chat: FC<chatProps> = ({ }) => {

    const socket = io.connect("http://localhost:4000");

    return <div>chat</div>
}

export default Chat