"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 

const UnionDetail = () => {
    const { id } = useParams(); 
    const [unionData, setUnionData] = useState(null);
    const [error, setError] = useState(null);

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
        </div>
    );
};

export default UnionDetail;
