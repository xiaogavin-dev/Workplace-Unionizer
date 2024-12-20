import { FC } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

interface chatHeaderProps {
    roomName: string | null;
}

interface chatBodyProps {
    messages: Array<{
        id: string;
        content: string;
        userId: string;
        userDn: string | null,
        chatId: string;
        createdAt: Date;
        updatedAt: Date;
        keyVersionId: string | null
    }>;
    currentUserId: string | null;
}

interface chatInputProps {
    form: any;
    onSubmit: (data: { message: string }) => void;
}

const ChatHeader: FC<chatHeaderProps> = ({ roomName }) => {
    return <>{roomName ? <div>{roomName}</div> : <div>Choose a chat</div>}</>;
};

const ChatBody: FC<chatBodyProps> = ({ messages, currentUserId }) => {
    return (
        <>
            {messages.map((message, index) => (
                <div
                    className={`flex mb-4 ${message.userId === currentUserId ? "justify-end " : "items-center"
                        } cursor-pointer gap-3`}
                    key={message.id}
                >
                    {message.userId !== currentUserId && (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center  bg-gray-200">
                            {message.userDn?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div
                        className={`flex max-w-96 p-3 gap-2 rounded-lg ${message.userId === currentUserId
                            ? "bg-[#81C67A] text-white"
                            : "bg-gray-200 text-black-700"
                            }`}
                    >

                        <p>{message.userId !== currentUserId ? <span className="text-xs text-gray-500 block">{message.userDn}</span> : <></>}

                            <span className="block">{message.content}</span>
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
};

const ChatInput: FC<chatInputProps> = ({ form, onSubmit }) => {
    const handleSubmit = async (data: any) => {
        await onSubmit(data);
        form.reset({
            message: "", // Reset 'message' field to an empty string
        });
    };

    const handleOnKeyDown = (e) => {
        // If the Enter key is pressed without the Shift key or Ctrl key
        if (e.key === "Enter" && (!e.shiftKey && !e.ctrlKey)) {
            e.preventDefault();
            form.handleSubmit(handleSubmit)();
        }
    };
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex items-center gap-2"  // Added gap for spacing
                >
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormControl>
                                    <Textarea
                                        placeholder="Message"
                                        className="resize-none"
                                        {...field}
                                        onKeyDown={handleOnKeyDown}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="flex items-center justify-center p-2 rounded-full bg-[#81C67A] text-white hover:bg-[#294224]">
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"                        >
                            <path
                                d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                </form>
            </Form>
        </>
    );
};

export { ChatHeader, ChatBody, ChatInput };
