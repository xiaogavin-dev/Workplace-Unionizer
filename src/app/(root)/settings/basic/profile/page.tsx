"use client"

import React from "react";
import Layout from '@/components/Layout';
import { useAppSelector } from "@/lib/redux/hooks/redux";
import "./profile.css"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Profile = () => {
    const { user } = useAppSelector(state => state.auth);
    const formSchemaAboutMe = z.object({
        aboutme: z.string().optional(),
    });

    const aboutMeForm = useForm<z.infer<typeof formSchemaAboutMe>>({
        resolver: zodResolver(formSchemaAboutMe),
        defaultValues: {
            aboutme: "",
        },
    });  


    return (
        <Layout>
            <div className='flex flex-col w-full h-full ml-64 p-4 left-20 fixed'>
                <div>
                    <div className="text-xl font-semibold mb-1">Display Name</div>
                    <div id="username-box-settings">{user?.email}</div>
                    <div className="text-xl font-semibold mt-1 mb-1">Profile Image</div>
                    <label htmlFor="input-file" id='drop-area-settings'>
                        <input type="file" accept='image/*' id='input-file' hidden/>
                        <div id="img-view">
                            <p id='upload-text-settings'>Upload Profile Image</p>
                        </div>
                    </label>
                    <div>250 x 250 Pixels</div>
                </div>
                <div className="text-xl font-semibold mt-1 mb-1">About Me</div>
                <div>
                <Form {...aboutMeForm}>
                        <form id="about-me">
                            <FormField
                                control={aboutMeForm.control}
                                name="aboutme"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea id="about-me-text-box"
                                                placeholder="About Me"
                                                {...field} 
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <button type='submit' id='save-button-settings'>Save</button>
            </div>
        </Layout>
    );
}

export default Profile;