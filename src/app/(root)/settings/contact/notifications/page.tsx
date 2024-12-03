"use client"

import React from "react";
import Layout from '@/components/Layout';
import DynamicSidebar from "@/components/dynamic-navbar";

const Notifications = () => {
    return (
        <Layout>
            <div
            className='flex flex-col w-full h-full ml-64 p-4 left-20 fixed'>
                Notifications
            </div>
        </Layout>
    );
}

export default Notifications;