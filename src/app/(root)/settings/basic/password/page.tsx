"use client"

import React from "react";
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validate";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./password.css"

const Password = () => {
    const formSchemaChangePassword = SignUpValidation.extend({
        currentPassword: z.string(),
        newPassword: z.string().min(8, { message: "Password must be atleast 8 characters long. "}), 
        confirmNewPassword: z.string()
    })

    const changePasswordForm = useForm<z.infer<typeof formSchemaChangePassword>>({
        resolver: zodResolver(formSchemaChangePassword),
        defaultValues: { 
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
    });

    return (
        <Layout>
            <div className='flex flex-col w-full h-full ml-64 p-4 fixed left-20'>
                <div className="text-xl font-semibold">Change Password</div>
                <div className="mt-1">
                    <Form {...changePasswordForm}>
                        <form className="max-w-xl space-y-2">
                            <FormField
                                control={changePasswordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>Current Password</FormLabel> */}
                                        <FormControl>
                                            <Input className='border-black' placeholder='Current Password' type='password' {...field} />
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
                                            <Input className='border-black' placeholder='New Password' type='password' {...field} />
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
                                            <Input className='border-black' placeholder='Confirm New Password' type='password' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <button type="submit" id="submit-button-password">Submit</button>
            </div>
        </Layout>
    );
}

export default Password;