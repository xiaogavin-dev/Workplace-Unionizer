"use client"

import React, { useState } from "react";
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validate";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./password.css"
import { getAuth, updatePassword } from "firebase/auth";

const Password = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string | null>(null);
    
    const auth = getAuth();

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

    async function onSubmit(values: z.infer<typeof formSchemaChangePassword>) {
        setError(null);
        
        if(!values.currentPassword && !values.newPassword && !values.confirmNewPassword) {
            setError("Please provide all given fields.");
            return;
        }
        
        setLoading(true);

        if(values.newPassword !== values.confirmNewPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        await updatePassword(auth.currentUser, values.newPassword).then(() => {
            setPassword("Password successfully changed.");
            console.log("Password successfully changed.");
        }).catch((error) => {
            console.log("Error: ", error);
            setError("Error in changing password."); 
        }).finally(() => {
            setLoading(false);
        });

        setLoading(false);
    }

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
                <button onClick={onSubmit} type="submit" id="submit-button-password" disabled={loading}>{loading ? "Submitting" : "Submit"}</button>
                {error && <p>{error}</p>}
                {password && <p>{password}</p>}
            </div>
        </Layout>
    );
}

export default Password;