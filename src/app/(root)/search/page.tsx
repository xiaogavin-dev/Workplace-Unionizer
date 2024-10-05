"use client"
import React, { useEffect, useState } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
    useEffect(() => {
        const getUnionsCall = async () => {
            try {
                const allUnionsRes = await getUnions()
                console.log(allUnionsRes)
                setAllUnions(allUnionsRes)
            }
            catch (e: any) {
                console.error(e.message)
            }
        }
        getUnionsCall()

    }, [])
    const formSchema = z.object({
        unionname: z.string(),
        location: z.string(),
        organization: z.string(),
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

    }


    return (
        <div className='search-page-container'>
            <Form {...form}>
                <div className='flex-center'>
                    <h1>Find A Union</h1>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="unionname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search</FormLabel>
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
                                <FormLabel>Location</FormLabel>
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
                                <FormLabel>Organization</FormLabel>
                                <FormControl>
                                    <Input placeholder="Organization Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button id="submit" type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default search