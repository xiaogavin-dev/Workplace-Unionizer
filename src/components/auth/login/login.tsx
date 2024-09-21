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
    FormDescription,
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

const login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    // Set persistence in a client component or useEffect hook
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
        }
        catch (e) {
            console.error('There was an error with sign in: ', e)
        }
        router.push('/')
        setLoading(false)
    }
    return (
        <div className='max-w-96 grow '>
            <Form {...form}>
                <div className='sm:w-420 flex-center flex-col py-3 '>
                    <h2 className='h3-bold md:h2-bold font-bold text-3xl pb-1 text-center'>Unionizer</h2>
                    <h3 className='text-center'>Login</h3>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-center'>
                        {loading ?
                            <PropagateLoader className='align-self-center' />
                            :
                            <Button className='w-full' type="submit">login</Button>
                        }
                    </div>
                </form>
            </Form>
        </div>)
}
export default login