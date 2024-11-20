"use client"

import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../firebase/firebase';
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/redux/hooks/redux';
import Layout from '@/components/Layout';
import "./settings.css"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { SignUpValidation } from '@/lib/validate';
import { Textarea } from '@/components/ui/textarea';
import DynamicSidebar from '@/components/dynamic-navbar';



const Settings = () => { 
    const router = useRouter();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');  // Redirect to the homepage if user is not authenticated
            }
        });

        return () => unsubscribe();
    }, [router]);

    const formSchemaAboutMe = z.object({
        aboutme: z.string().optional(),
    });

    const formSchemaChangePassword = SignUpValidation.extend({
        currentPassword: z.string(),
        newPassword: z.string().min(8, { message: "Password must be atleast 8 characters long. "}), 
        confirmNewPassword: z.string()
    })


    const aboutMeForm = useForm<z.infer<typeof formSchemaAboutMe>>({
        resolver: zodResolver(formSchemaAboutMe),
        defaultValues: {
            aboutme: "",
        },
    });

    const changePasswordForm = useForm<z.infer<typeof formSchemaChangePassword>>({
        resolver: zodResolver(formSchemaChangePassword),
        defaultValues: { 
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
    });

    async function onSubmit(aboutme: z.infer<typeof formSchemaAboutMe>, changepassword: z.infer<typeof formSchemaChangePassword>) { 

    }

    return (
        <Layout>
            <div
            className='flex flex-col w-full h-full ml-64 p-4'>
                Settings
            </div>
        </Layout>
    );
}

export default Settings;