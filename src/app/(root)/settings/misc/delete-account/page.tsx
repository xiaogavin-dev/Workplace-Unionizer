"use client"

import React from "react";
import Layout from '@/components/Layout';
import DynamicSidebar from "@/components/dynamic-navbar";

const DeleteAccount = () => {
    return (
        <Layout>
            <div
            className='flex flex-col w-full h-full ml-64 p-4'>
                Delete Account
            </div>
        </Layout>
    );
}

export default DeleteAccount;