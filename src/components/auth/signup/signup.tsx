"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignUpValidation } from '@/lib/validate'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/redux/hooks/redux';
import { setAuthState } from '@/lib/redux/features/auth/authSlice';
import "../login/signin.css"

const SignUpSchema = SignUpValidation.extend({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string()
});
const signup = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string | null>(null); // State for password error

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        // Check if password and confirmPassword match
        if (values.password !== values.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            if (auth.currentUser) {
                console.log(auth.currentUser);
                await updateProfile(auth.currentUser, {
                    displayName: values.username
                });

                dispatch(setAuthState({
                    isAuthenticated: true,
                    user: {
                        displayName: values.username,
                        uid: auth.currentUser.uid,
                        email: values.email,
                    },
                }));
                try {
                    const token = await auth.currentUser.getIdToken();
                    const res = await fetch('http://localhost:5000/users/verify-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token })
                    })
                    console.log(res)
                } catch (error) {
                    console.log(error)
                }
                router.push('/search');
            }
        } catch (error: any) {
            setLoading(false);

            // Check for email already in use error
            if (error.code === 'auth/email-already-in-use') {
                console.error("Email is already in use!");
                alert("The email address is already in use by another account.");
            } else {
                console.error("There was an error signing up:", error.message);
                alert(error.message);
            }
        }
    }
    return (
        <div className='login-center-container'>
            <Form {...form}>
                <div className='sm:w-420 flex-center flex-col py-3 '>
                    <h2 className='h3-bold md:h2-bold font-bold text-4xl pb-1 text-center'>Unionizer</h2>
                    <h3 className='text-center'>Create an Account</h3>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Confirm your password" type="password" {...form.register('confirmPassword')} />
                        </FormControl>
                        {passwordError && <p className="text-red-600">{passwordError}</p>}
                        <FormMessage />
                    </FormItem>

                    <div className='flex justify-center'>
                        {loading ?
                            <PropagateLoader className='align-self-center' />
                            :
                            <Button className='w-full hover:bg-blue-700' type="submit">Sign Up</Button>
                        }
                    </div>
                    <h3 id="new-to-unionizer">Already have an account? <Link href="/auth/login">Login</Link></h3>
                </form>
            </Form>
        </div>)
}
export default signup