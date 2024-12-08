"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish a socket connection when the app mounts
        const newSocket = io('localhost:5000',);

        setSocket(newSocket);

        // Clean up the connection when the component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket context
export const useSocket = () => {
    return useContext(SocketContext);
};
