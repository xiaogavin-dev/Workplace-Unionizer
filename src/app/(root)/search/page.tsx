"use client"
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import getUnions from "./actions"
import "./search.css"

interface Unions {
    id: string,
    unionName: string
}

const search = () => {
    const [allUnions, setAllUnions] = useState<Array<Unions> | undefined>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formSchema = z.object({
        unionname: z.string().optional(),
        location: z.string().optional(),
        organization: z.string().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unionname: "",
            location: "",
            organization: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);

        setAllUnions([]);

        try {
            const queryString = new URLSearchParams({
                unionname: values.unionname,
            }).toString();
    
            const response = await fetch(`http://localhost:5000/union/getUnions?${queryString}`);
    
            if (!response.ok) {
                throw new Error('Error fetching unions');
            }
    
            const data = await response.json();
    
            if (data.data.length === 0) {
                setError("No unions found");
            } else {
                setAllUnions(data.data);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
            setError("No unions found");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='search-page-container'>
            <Form {...form}>
                <div className='find-a-union'>
                    <h1>Find A Union</h1>
                </div>
                <form id="search-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="unionname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='find-tags'>Search</FormLabel>
                                <FormControl>
                                    <Input placeholder="Union Name" {...field} />
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
                                    <Input placeholder="City, State" {...field} />
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
                                    <Input placeholder="Organization Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button id="submit" type="submit" disabled={loading}>
                        {loading ? 'Searching...' : 'Submit'}
                    </Button>
                </form>

                {error && <p>{error}</p>}

                {allUnions?.length > 0 && (
                    <div className='union-results'>
                        {allUnions.map((union) => (
                            <Button key={union.id} className='union-button'>
                                {union.name}
                            </Button>
                        ))}
                    </div>
                )}
            </Form>
        </div>
    );
};


export default search