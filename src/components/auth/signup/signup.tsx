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
    FormDescription,
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
import "../login/signin.css"
const signup = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })
    const [loading, setLoading] = useState<boolean>(false)
    async function onSubmit(values: z.infer<typeof SignUpValidation>) {
        setLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password)
            if (auth.currentUser) {
                console.log(auth.currentUser)
                await updateProfile(auth.currentUser, {
                    displayName: values.username
                })
            }
            else {
                throw ("no current user found: LINE 58 ACTIONS.TS: ")
            }
        }
        catch (e) {
            console.error("There was an error signing up! ")
        }
        router.push('/')
        setLoading(false)


    }
    return (
        <div className='max-w-96 grow mt-60 p-4 max-h-fit border-2 shadow-lg '>
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
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
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
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your email.
                                </FormDescription>
                                <FormMessage />
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
                                    <Input placeholder="shadcn" type='password' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter a strong password
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-center'>
                        {loading ?
                            <PropagateLoader className='align-self-center' />
                            :
                            <Button className='w-full' type="submit">signup</Button>
                        }
                    </div>
                    <h3 id="new-to-unionizer">Already have an account? <Link href="/auth/login" id="join-now">Login</Link></h3>
                </form>
            </Form>
        </div>)
}
export default signup