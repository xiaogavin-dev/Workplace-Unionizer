"use client"
import React from 'react'
import Navbar from '../components/navbar/navbar'
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '../lib/redux/store'
const app = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const store: AppStore = makeStore();
    return (
        <Provider store={store}>
            <Navbar />
            <div className='min-h-screen flex justify-center '>
                {children}
            </div>
        </Provider>
    )
}

export default app