"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import "./joinunion.css";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks/redux";
import { setUserUnions } from "@/lib/redux/features/user_unions/userUnionsSlice";
import { handleMemberJoin } from "@/lib/util/handleKeyUpdates";

interface UnionData {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface Question {
  id: string;
  questionText: string;
}

const JoinUnion = () => {
  const { id: unionId } = useParams();

  const [unionData, setUnionData] = useState<UnionData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/form/questions/${unionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        setQuestions(data.data);
        setAnswers(new Array(data.data.length).fill(""));
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
      console.error("Union ID not found in URL.");
      setLoading(false);
    }
  }, [unionId]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const onSubmit = async () => {
    const joinUnion = async () => {
      try {
        const userUnionInfo = {
          userId: user?.uid,
          unionId,
          role: "general",
        };
        const response = await fetch(
          `http://localhost:5000/union/joinUnion`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userUnionInfo }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to join the union");
        }
        const responseData = await response.json();
        await handleMemberJoin(unionData?.id, user?.uid);
      } catch (error) {
        console.error("Issue joining union");
      }

      try {
        const userUnionsRes = await fetch(
          `http://localhost:5000/union/getUserUnions?userId=${user?.uid}`
        );
        if (!userUnionsRes.ok) {
          throw new Error("Failed to fetch user unions");
        }
        const data = await userUnionsRes.json();
        dispatch(
          setUserUnions({
            unions: data.data,
          })
        );
      } catch (e) {
        console.error("There was an error receiving user unions", e);
      }
    };
    joinUnion();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className="join-union-page">
        {unionData ? (
          <>
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
            <div className="questions-container">
              {questions.map((question, index) => (
                <div key={question.id} className="form-field">
                  <label>{question.questionText}</label>
                  <input
                    type="text"
                    placeholder="Aa"
                    value={answers[index]}
                    onChange={(e) =>
                      handleAnswerChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                className="submit-form-button"
                onClick={() => onSubmit()}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <p>No union data found.</p>
        )}
      </div>
    </Layout>
  );
};

export default JoinUnion;
