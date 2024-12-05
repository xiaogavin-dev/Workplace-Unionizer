"use client"
import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignInValidation } from '@/lib/validate'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import PropagateLoader from "react-spinners/PropagateLoader"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/redux/hooks/redux';
import { setAuthState } from '@/lib/redux/features/auth/authSlice';
import { setUserUnions } from '@/lib/redux/features/user_unions/userUnionsSlice';
import './signin.css'

const login = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log('Persistence set successfully');
            })
            .catch((error) => {
                console.error('Error setting persistence:', error);
            });
    }, []);

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password)
            if (auth.currentUser) {
                try {
                    const token = await auth.currentUser.getIdToken();
                    const verifyRes = await fetch('http://localhost:5000/users/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token })
                    })
                    console.log(verifyRes)
                    dispatch(setAuthState({
                        isAuthenticated: true,
                        user: {
                            displayName: auth.currentUser.displayName,
                            uid: auth.currentUser.uid,
                            email: values.email,
                        },
                    }));
                } catch (error) {
                    console.log("error logging in", error)
                }
                try {
                    const userUnionsRes = await fetch(`http://localhost:5000/union/getUserUnions?userId=${auth.currentUser.uid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    if (!userUnionsRes.ok) {
                        throw new Error('Response error')
                    }
                    const data = await userUnionsRes.json()
                    dispatch(setUserUnions({
                        unions: data.data
                    }))
                } catch (e) {
                    console.error('There was an error receiving user unions', e)
                }
            }
        } catch (e) {
            console.error('There was an error with logging in: ', e)
        }

        router.push('/search')
        setLoading(false)
    }

    return (
        <div className="login-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                    <div className="login-header">
                        <h2 className="title">Login</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="form-item">
                                <FormLabel className="form-label">Email</FormLabel>
                                <FormControl className="form-control">
                                    <Input
                                        className="form-input"
                                        placeholder="Enter your email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="form-message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="form-item">
                                <FormLabel className="form-label">Password</FormLabel>
                                <FormControl className="form-control">
                                    <Input
                                        className="form-input"
                                        placeholder="Enter your password"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="form-message" />
                            </FormItem>
                        )}
                    />

                    <h3 className="forgot-password">
                        <a href="/auth/forgotpassword">Forgot Password?</a>
                    </h3>
                    <div className="button-container">
                        {loading ? (
                            <PropagateLoader />
                        ) : (
                            <Button className="submit-button" type="submit">Login</Button>
                        )}
                    </div>
                    <h3 className="signup-link">
                        New to Unionizer? <Link href="/auth/signup">Join now</Link>
                    </h3>
                </form>
            </Form>
        </div>
    );
}

export default login;