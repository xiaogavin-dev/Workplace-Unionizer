"use client"

import React, { useState } from "react";
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import "./email.css"
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail } from "firebase/auth";

interface formSchemaChangeEmail {
    currentEmail: string,
    currentPassword: string,
    newEmail: string,
    confirmNewEmail: string,
}

const Email = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const changeEmailForm = useForm<formSchemaChangeEmail>({
        defaultValues: { 
            currentEmail: "",
            currentPassword: "",
            newEmail: "",
            confirmNewEmail: ""
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Auth information
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const form = e.target;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

        if(!values.currentEmail && !values.currentPassword && !values.newEmail && !values.confirmNewEmail) {
            setError("Please provide all given fields.");
            return;
        }

        if(values.newEmail !== values.confirmNewEmail) {
            setError("Emails do not match.");
            setLoading(false);
            return;
        }


        setLoading(true);
        const credential = EmailAuthProvider.credential(
            values.currentEmail,
            values.currentPassword
        )

        await reauthenticateWithCredential(currentUser, credential)
        .then(() => {
            updateEmail(currentUser, values.newEmail)
            .then(() => {
                setEmail("Successfully changed email.");
                reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(values.newEmail, values.currentPassword));
            })
            .catch((e) => {
                setError("There was an unknown error changing your email.");
                console.log(e);
            })
        })
        .catch((e) => {
            setError("Invalid password.");
            console.log(e);
        });

        setLoading(false);
    }

    return (
        <Layout>
            <div className='flex flex-col w-full h-full ml-64 p-4 fixed left-20'>
                <div className="text-xl font-semibold">Change Email</div>
                <div className="mt-1">
                    <Form {...changeEmailForm}>
                        <form className="max-w-xl space-y-2" onSubmit={handleSubmit}>
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
                            <button type="submit" id="submit-button-email">Submit</button>
                        </form>
                    </Form>
                </div>
                {error && <p>{error}</p>}
                {email && <p>{email}</p>}
            </div>
        </Layout>
    );
}

export default Email;