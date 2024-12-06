"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import "./joinunionform.css";

interface UnionData {
    id: string;
    name: string;
    description: string;
    image?: string;
}

const JoinUnionForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const unionId = searchParams.get("unionId");
    const [unionData, setUnionData] = useState<UnionData | null>(null);
    const [defaultImage, setDefaultImage] = useState<JSX.Element | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [questions, setQuestions] = useState([
        "Which location do you work at?",
        "What is your job title?",
        "Who is your manager?",
        "How else can we contact you?",
    ]);

    useEffect(() => {
        if (unionId) {
            const fetchUnionData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/union/getUnion/${unionId}`
                    );
                    if (!response.ok) throw new Error("Failed to fetch union data");

                    const data = await response.json();
                    setUnionData(data.data);
                } catch (err) {
                    const error = err as Error;
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUnionData();
        }
    }, [unionId]);

    useEffect(() => {
        if (unionData) {
            const savedColors = JSON.parse(
                localStorage.getItem("unionColors") || "{}"
            );
            const backgroundColor = savedColors[unionData.id] || "#ccc";

            setDefaultImage(
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
                    {unionData.name?.[0]?.toUpperCase() || "?"}
                </div>
            );
        }
    }, [unionData]);

    const handleAddQuestion = () => setQuestions([...questions, ""]);
    const handleRemoveQuestion = (index: number) =>
        setQuestions(questions.filter((_, i) => i !== index));
    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = value;
        setQuestions(updatedQuestions);
    };

    const handleSaveQuestions = async () => {
        if (!unionId) {
            setMessage("Union ID is missing.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/form/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    unionId,
                    questions,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save questions");
            }

            setMessage("Questions saved successfully!");
            router.push(`/search`);
        } catch (error) {
            console.error("Error saving questions:", error);
            setMessage("An error occurred while saving questions.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className="join-unionform-page">
                {unionData && (
                    <div className="union-info">
                        {unionData.image ? (
                            <img
                                src={`http://localhost:5000${unionData.image}`}
                                alt={`${unionData.name} Logo`}
                                className="result-image"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/Unionizer_Logo.png";
                                }}
                            />
                        ) : (
                            defaultImage
                        )}
                        <div className="union-details">
                            <h1>{unionData.name}</h1>
                            <p>{unionData.description}</p>
                        </div>
                    </div>
                )}

                <div className="questions-section">
                    {questions.map((question, index) => (
                        <div className="question-remove-container" key={index}>
                            <div className="question-input">
                                <textarea
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Question ${index + 1}`}
                                    onInput={(e) => {
                                        const textarea = e.target as HTMLTextAreaElement;
                                        textarea.style.height = "auto";
                                        textarea.style.height = `${textarea.scrollHeight}px`;
                                    }}
                                />
                            </div>
                            <button
                                className="remove-question-button"
                                onClick={() => handleRemoveQuestion(index)}
                            >
                                <b>-</b>
                            </button>
                        </div>
                    ))}

                    <div>{message ? message : null}</div>
                    <div className="save-add-button-container">
                        <button className="save-form-button bottom-[64px] relative" onClick={handleSaveQuestions}>
                            Save
                        </button>
                        <button className="add-question-button bottom-[64px] relative" onClick={handleAddQuestion}>
                            <b>+</b>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JoinUnionForm;
