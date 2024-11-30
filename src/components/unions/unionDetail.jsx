"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { setUserUnions } from '@/lib/redux/features/user_unions/userUnionsSlice';
const UnionDetail = () => {
    const { id } = useParams();
    const [unionData, setUnionData] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    useEffect(() => {
        const fetchUnion = async () => {
            try {
                // Use the specific route for fetching a union by ID
                const response = await fetch(`http://localhost:5000/union/getUnion/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch union data');
                }
                const data = await response.json();

                setUnionData(data.data);
            } catch (error) {
                setError(error.message);
            }
        };

        if (id) {
            fetchUnion();
        }
    }, [id]);
    const joinUnion = async () => {
        try {
            const userUnionInfo = {
                userId: user?.uid,
                unionId: id,
                role: 'general'
            }
            const response = await fetch(`http://localhost:5000/union/joinUnion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userUnionInfo })
            })
            if (!response.ok) {
                throw new Error("There was an error with the response")
            }
            const responseData = await response.json()
        } catch (error) {
            console.log("Issue joining union")
        }
        try {
            const userUnionsRes = await fetch(`http://localhost:5000/union/getUserUnions?userId=${user.uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!userUnionsRes.ok) {
                throw new Error('Response error')
            }
            const data = await userUnionsRes.json()
            dispatch(setUserUnions({
                unions: data.data
            }))
        } catch (e) {
            console.error('There was an error receiving user unions', e)
        }
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!unionData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{unionData.name}</h1>
            <p>Status: {unionData.status}</p>
            <p>Location: {unionData.location}</p>
            <p>Organization: {unionData.organization}</p>
            <Button onClick={() => { joinUnion() }}>join</Button>
        </div>
    );
};
export default UnionDetail