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
                router.push('/');  // Redirect to the homepage if user is not authenticated
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

        setLoading(true);
        setError(null);
        setAllUnions([]);

        try {
            const queryString = new URLSearchParams({
                unionname: values.unionname || '',
                location: values.location || '',
                organization: values.organization || '',
            }).toString();

            const response = await fetch(`http://localhost:5000/union/getUnions?${queryString}`);

            if (!response.ok) {
                throw new Error('Error fetching unions');
            }

            const data = await response.json();

            if (data.data.length === 0) {
                setError("No unions found for the specified criteria");
            } else {
                setAllUnions(data.data);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
            setError("No unions found for the specified criteria");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="page-wrapper">
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
                                    {loading ? 'Searching...' : 'Search'}
                                </Button>
                            </form>

                            {error && <p>{error}</p>}

                             {allUnions?.length > 0 && (
                                <div className='union-results'>
                                    {allUnions.map((union) => (
                                        <Button 
                                            key={union.id} 
                                            className='union-button'
                                            onClick={() => router.push(`/unions/${union.id}`)} // Navigate to the specific union page
                                        >
                                            {union.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;
