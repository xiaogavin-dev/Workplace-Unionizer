"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import './joinunion.css';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';

const JoinUnion = () => {
  const { id: unionId } = useParams();

  const [unionData, setUnionData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUnionData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/union/getUnion/${unionId}`);
        if (!response.ok) throw new Error('Failed to fetch union data');

        const data = await response.json();
        setUnionData(data.data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/form/questions/${unionId}`);
        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        setQuestions(data.data);
        setAnswers(new Array(data.data.length).fill(''));
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (unionId) {
      fetchUnionData();
      fetchQuestions();
    } else {
      setError('Union ID not found in URL.');
      setLoading(false);
    }
  }, [unionId]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const onSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/form/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unionId,
          userId: user?.uid,
          answers: answers.map((answer, index) => ({
            questionId: questions[index]?.id,
            answerText: answer,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      alert('Successfully joined the union and submitted answers!');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('An error occurred while submitting answers.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className="join-union-page">
        {unionData && (
          <div className="union-card">
            <img
              src={unionData.imageUrl || "https://via.placeholder.com/60"}
              alt="Union Logo"
              className="union-logo"
            />
            <div className="union-info">
              <h3>{unionData.name}</h3>
              <p>{unionData.description}</p>
            </div>
          </div>
        )}
        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={question.id} className="form-field">
              <label>{question.questionText}</label>
              <input
                type="text"
                placeholder="Aa"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
           </div>
              <button className="submit-form-button" onClick={() => onSubmit()}>Submit</button>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default JoinUnion;
