"use client";

import { FC, useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

interface PageProps {
    params: {
        pollId: string;
    };
}

const PollPage: FC<PageProps> = ({ params }: PageProps) => {
    const { pollId } = params;
    const { user } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, router]);

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Poll {pollId}</h1>
            </div>
        </Layout>
    );
};

export default PollPage;
