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

    // Handle adding a new question
    const handleAddQuestion = () => setQuestions([...questions, ""]);

    // Handle removing a question
    const handleRemoveQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));

    // Handle changing a question's value
    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = value;
        setQuestions(updatedQuestions);
    };

    // Save questions to the backend
    const handleSaveQuestions = async () => {
        if (!unionId) {
            alert("Union ID is missing.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/form/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unionId,
                    questions,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save questions');
            }
    
            const data = await response.json();
            alert('Questions saved successfully!');
        } catch (error) {
            console.error('Error saving questions:', error);
            alert('An error occurred while saving questions.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className="join-unionform-page">
                {unionData && (
                    <div className="union-header">
                        {/* Union details */}
                        <div className="union-info">
                            <h3>{unionData.name}</h3>
                            <p>{unionData.description}</p>
                        </div>
                    </div>
                )}

                {/* Form for creating questions */}
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
                        <button className="save-form-button" onClick={handleSaveQuestions}>
                            Save
                        </button>
                        <button className="add-question-button" onClick={handleAddQuestion}>
                            <b>+</b>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JoinUnionForm;
