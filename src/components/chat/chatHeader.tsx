import { FC } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '../ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
interface chatHeaderProps {
    roomName: string | null
}
interface chatBodyProps {
    sentMessages: { message: string[] },
    receivedMessages: { message: string[] }
}
interface chatInputProps {
    form: any,
    onSubmit: any
}

const ChatHeader: FC<chatHeaderProps> = ({ roomName }) => {
    return (<>
        {roomName ? <div>{roomName}</div> : <div> choose a chat</div>}
    </>)
}

const ChatBody: FC<chatBodyProps> = ({ sentMessages, receivedMessages }) => {
    return (<>
        {sentMessages.message.toReversed().map((message, index) => (
            <div className='flex justify-end mb-4 cursor-pointer'>
                <div className='flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3'>
                    <p key={index} >{message}</p>
                </div>
            </div>
        ))}
        {receivedMessages.message.toReversed().map((message, index) => (
            <div className='flex mb-4 cursor-pointer'>
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                </div>
                <div className='flex max-w-96 bg-white rounded-lg p-3 gap-3'>
                    <p key={index} className='text-gray-700'>{message}</p>
                </div>
            </div>
        ))}
    </>
    );
};
/*
`           <div class="flex justify-end mb-4 cursor-pointer">
                 <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                   <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
                 </div>
                 <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                   <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full">
                 </div>
            </div>
};
*/
const ChatInput: FC<chatInputProps> = ({ form, onSubmit }) => {
    return (
        <>
            <Form {...form} className={""}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full flex align-items-center">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className='grow'>
                                <FormControl>
                                    <Textarea
                                        placeholder="Message"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className=' h-full'>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">

                            </path>
                        </svg>
                    </Button>

                </form>
            </Form>
        </>
    )
}

export { ChatHeader, ChatBody, ChatInput }