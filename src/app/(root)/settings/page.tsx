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

    const form = useForm<z.infer<typeof formSchemaAboutMe>>({
        resolver: zodResolver(formSchemaAboutMe),
        defaultValues: {
            aboutme: "",
        },
    });

    return (
        <Layout>
            <div className='page-wrapper'>
                <div className='display-name'>Display Name
                    <div id="username-box">{user?.displayName}</div>
                </div>
                <div className='about-me'>About Me
                    <Form {...form}>
                        <form id="about-me">
                            <FormField
                                    control={form.control}
                                    name="aboutme"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="About Me" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                        </form>
                    </Form>
                </div>
                <div className='change-password'>
                    {/* <Form {...form}>
                        <form id="change-password-form" onSubmit={Form.handleSubmit(onSubmit)}>

                        </form>
                    </Form> */}
                </div>
            </div>
        </Layout>
    );
}

export default Settings;