"use client"
import React from 'react'
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

const search = () => {
    const formSchema = z.object({
        _unionname: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _unionname: "",
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
                        name="_unionname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search</FormLabel>
                                <FormControl>
                                    <Input placeholder="Union Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                        />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default search