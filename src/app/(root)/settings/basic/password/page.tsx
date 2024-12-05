"use client"

import React, { useState } from "react";
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import "./password.css"
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";

interface formSchemaChangePassword {
    currentPassword: string,
    newPassword: string, 
    confirmNewPassword: string
}

const Password = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string | null>(null);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    

    const changePasswordForm = useForm<formSchemaChangePassword>({
        defaultValues: { 
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null);

        const form = e.target;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

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

        const credential = EmailAuthProvider.credential(
            currentUser?.email,
            values.currentPassword
        )

        await reauthenticateWithCredential(currentUser, credential)
        .then(() => {
            updatePassword(currentUser, values.newPassword)
            .then(() => {
                setPassword("Successfully changed password.");
                reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(currentUser?.email, values.newPassword));
            })
            .catch((e) => {
                console.log(e);
                setError("Error setting password.");
            })
        })
        .catch((e) => {
            console.log(e);
            setError("Error setting password.");
        })

        setLoading(false);
    }

    return (
        <Layout>
            <div className='flex flex-col w-full h-full ml-64 p-4 fixed left-20'>
                <div className="text-xl font-semibold">Change Password</div>
                <div className="mt-1">
                    <Form {...changePasswordForm}>
                        <form className="max-w-xl space-y-2" onSubmit={handleSubmit}>
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
                            <button type="submit" id="submit-button-password" disabled={loading}>{loading ? "Submitting" : "Submit"}</button>
                        </form>
                    </Form>
                </div>
                {error && <p>{error}</p>}
                {password && <p>{password}</p>}
            </div>
        </Layout>
    );
}

export default Password;