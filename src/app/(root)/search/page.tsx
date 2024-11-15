"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./search.css";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../firebase/firebase';

interface Unions {
    id: string;
    name: string;
    location: string;
    organization: string;
}

const Search = () => {
    const [allUnions, setAllUnions] = useState<Array<Unions> | undefined>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const formSchema = z.object({
        unionname: z.string().optional(),
        location: z.string().optional(),
        organization: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unionname: "",
            location: "",
            organization: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.unionname && !values.location && !values.organization) {
            setError("Please provide at least one search parameter.");
            setAllUnions([]);
            return;
        }

        const query = {
            unionname: values.unionname || '',
            location: values.location || '',
            organization: values.organization || '',
        };
        const queryString = new URLSearchParams(query).toString();
        router.push(`/results?${queryString}`);

    }


    return (
        <Layout>
            <div className="find-page-wrapper">
                <div className="content-container">
                    <div className="search-page-container">
                        <Form {...form}>
                            <form id="search-form" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="unionname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='find-tags'>Search</FormLabel>
                                            <FormControl>
                                                <Input className="custom-input" placeholder="Union Name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='find-tags'>Location</FormLabel>
                                            <FormControl>
                                                <Input className="custom-input" placeholder="City, State" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="organization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='find-tags'>Organization</FormLabel>
                                            <FormControl>
                                                <Input className="custom-input" placeholder="Organization Name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button id="submit" type="submit" disabled={loading}>
                                    {loading ? 'Searching...' : 'Find a Union'}
                                </Button>
                            </form>

                            {error && <p>{error}</p>}

                            {allUnions?.length > 0 && (
                                <div className='union-results'>
                                    {allUnions.map((union) => (
                                        <Button
                                            key={union.id}
                                            className='union-button'
                                            onClick={() => router.push(`/unions/${union.id}`)}
                                        >
                                            {union.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </Form>
                        <div className="create-page-container">
                            <h2>New Union?</h2>
                            <Button
                                id="submit"
                                type="button"
                                className="create-union-button"
                                onClick={() => router.push('/createunion')}
                            >
                                Create a Union
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;
