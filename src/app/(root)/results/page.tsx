"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import "./results.css";

const Results = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [unionName, setUnionName] = useState<string>(searchParams.get("unionname") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [organization, setOrganization] = useState(searchParams.get("organization") || "");
    const defaultImage = "/images/Unionizer_Logo.png";
    
    const getDefaultImage = (union) => {
        const savedColors = JSON.parse(localStorage.getItem("unionColors") || "{}");
        const backgroundColor = savedColors[union.id] || "#ccc";
        return (
            <div
                style={{
                    backgroundColor,
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                }}
            >
                {union.name?.[0]?.toUpperCase()}
            </div>
        );
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResults([]);

        try {
            const queryString = new URLSearchParams({
                unionname: unionName,
                location,
                organization,
            }).toString();

            const response = await fetch(
                `http://localhost:5000/union/getUnions?${queryString}`
            );

            if (!response.ok) throw new Error("Error fetching unions");

            const data = await response.json();
            setResults(data.data.length ? data.data : []);
            if (data.data.length === 0)
                setError("No unions found for the specified criteria");
        } catch (error) {
            console.error("Error:", error.message);
            setError("No unions found for the specified criteria");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            const queryString = new URLSearchParams({
                unionname: searchParams.get("unionname") || "",
                location: searchParams.get("location") || "",
                organization: searchParams.get("organization") || "",
            }).toString();

            try {
                const response = await fetch(
                    `http://localhost:5000/union/getUnions?${queryString}`
                );
                const data = await response.json();
                if (response.ok) {
                    setResults(data.data || []);
                } else {
                    console.error("Failed to fetch unions:", data.message);
                }
            } catch (error) {
                console.error("Error fetching unions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchParams]);

    const handleJoin = (unionId) => {
        router.push(`/joinunion/${unionId}`);
    };

    return (
        <Layout>
            <div className="results-page">
                <div className="search-container">
                    <form onSubmit={handleSearch} className="search-bar">
                        <div className="search-field">
                            <label>Union</label>
                            <input
                                type="text"
                                placeholder="Union Name"
                                value={unionName}
                                onChange={(e) => setUnionName(e.target.value)}
                            />
                        </div>
                        <div className="search-field">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="search-field">
                            <label>Organization</label>
                            <input
                                type="text"
                                placeholder="Organization"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="search-button">
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="results-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : results.length > 0 ? (
                        results.map((union) => (
                            <div key={union.id} className="result-item">
                                {union.image ? (
                                    <img
                                        src={`http://localhost:5000${union.image}`}
                                        alt={`${union.name} Logo`}
                                        className="result-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                ) : (
                                    getDefaultImage(union)
                                )}
                                <div className="result-details">
                                    <h3>{union.name}</h3>
                                    <p>{union.description}</p>
                                    <p>{union.organization}</p>
                                </div>
                                <button
                                    className="join-button"
                                    onClick={() => handleJoin(union.id)}
                                >
                                    Join
                                </button>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Results;
