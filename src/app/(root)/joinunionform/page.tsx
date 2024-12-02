"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import './joinunionform.css';

interface UnionData {
    name: string;
    description: string;
}

const JoinUnionForm = () => {
    const searchParams = useSearchParams();
    const unionId = searchParams.get('unionId');
    const [unionData, setUnionData] = useState<UnionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState([
        "Which location do you work at?",
        "What is your job title?",
        "Who is your manager?",
        "What are other ways we can get in contact with you?"
    ]);

    useEffect(() => {
        if (unionId) {
            const fetchUnionData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/union/getUnion/${unionId}`);
                    if (!response.ok) throw new Error('Failed to fetch union data');

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

    const handleAddQuestion = () => setQuestions([...questions, ""]);
    const handleRemoveQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));
    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = value;
        setQuestions(updatedQuestions);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className="join-unionform-page">
                {unionData && (
                    <div className="union-header">
                        {/* <img src="/path/to/union-logo.png" alt="Union Logo" className="union-logo" /> */}
                        <div className="union-info">
                            <h3>{unionData.name}</h3>
                            <p>{unionData.description}</p>
                        </div>
                    </div>
                )}

                <div className="questions-section">
                    {questions.map((question, index) => (
                        <div className="question-remove-container" key={index}>
                            <div className="question-input">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Question ${index + 1}`}
                                />
                            </div>
                            <button className="remove-question-button" onClick={() => handleRemoveQuestion(index)}>
                                <b>-</b>
                            </button>
                        </div>
                    ))}
                    <div className="save-add-button-container">
                        <button className="save-form-button">Save</button>
                        <button className="add-question-button" onClick={handleAddQuestion}><b>+</b></button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JoinUnionForm;
