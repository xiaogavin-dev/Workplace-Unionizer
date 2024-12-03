"use client"

import React from "react";
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validate";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./email.css"

const Email = () => {
    const formSchemaChangeEmail = SignUpValidation.extend({
        currentEmail: z.string(),
        newEmail: z.string(), 
        confirmNewEmail: z.string()
    })

    const changeEmailForm = useForm<z.infer<typeof formSchemaChangeEmail>>({
        resolver: zodResolver(formSchemaChangeEmail),
        defaultValues: { 
            currentEmail: "",
            newEmail: "",
            confirmNewEmail: ""
        },
    });

    return (
        <Layout>
            <div className='flex flex-col w-full h-full ml-64 p-4 fixed left-20'>
                <div className="text-xl font-semibold">Change Email</div>
                <div className="mt-1">
                    <Form {...changeEmailForm}>
                        <form className="max-w-xl space-y-2">
                            <FormField
                                control={changeEmailForm.control}
                                name="currentEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>Current Password</FormLabel> */}
                                        <FormControl>
                                            <Input className='border-black' placeholder='Current Email' type='email' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={changeEmailForm.control}
                                name="newEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>New Password</FormLabel> */}
                                        <FormControl>
                                            <Input className='border-black' placeholder='New Email' type='email' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={changeEmailForm.control}
                                name="confirmNewEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>Confirm New Password</FormLabel> */}
                                        <FormControl>
                                            <Input className='border-black' placeholder='Confirm New Email' type='email' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <button type="submit" id="submit-button-email">Submit</button>
            </div>
        </Layout>
    );
}

export default Email;