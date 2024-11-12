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
            <div className='page-wrapper'>
                <div className='display-name'>Display Name
                    <div id="username-box">{user?.email}</div>
                </div>
                <div className='about-me'>About Me
                    <Form {...aboutMeForm}>
                        <form id="about-me">
                            <FormField
                                control={aboutMeForm.control}
                                name="aboutme"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input id="about-me-text-box" placeholder="About Me" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <div className='change-password'>
                    <Form {...changePasswordForm}>
                        <FormLabel id="change-password-title">Change Password</FormLabel>
                        <form id="change-password-form">
                            <FormField
                                control={changePasswordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>Current Password</FormLabel> */}
                                        <FormControl>
                                            <Input placeholder='Current Password' type='password' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={changePasswordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>New Password</FormLabel> */}
                                        <FormControl>
                                            <Input placeholder='New Password' type='password' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={changePasswordForm.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>Confirm New Password</FormLabel> */}
                                        <FormControl>
                                            <Input placeholder='Confirm New Password' type='password' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <button id="submit-button" type="submit">Apply</button>
                    {/* {message && <p>{message}</p>} */}
                </div>
            </div>
        </Layout>
    );
}

export default Settings;