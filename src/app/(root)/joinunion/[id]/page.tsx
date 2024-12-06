"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import "./joinunion.css";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks/redux";
import { setUserUnions } from "@/lib/redux/features/user_unions/userUnionsSlice";
import { handleMemberJoin } from '@/lib/util/handleKeyUpdates';
interface UnionData {
  id: string;
  name: string;
  description: string;
  image?: string; // Backend field for the image
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
  const [joined, setJoined] = useState<string>("");
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
        setError((err as Error).message);
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
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (unionId) {
      fetchUnionData();
      fetchQuestions();
    } else {
      setError("Union ID not found in URL.");
      setLoading(false);
    }
  }, [unionId]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const onSubmit = async () => {
    try {
      const formAnswers = questions.map((question, index) => ({
        questionId: question.id,
        unionId,
        userId: user?.uid,
        answer: answers[index],
      }));

      const answersResponse = await fetch(`http://localhost:5000/form/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formAnswers }),
      });

      if (!answersResponse.ok) {
        throw new Error("Failed to submit form answers");
      }

      const userUnionInfo = {
        userId: user?.uid,
        unionId,
        role: "general",
      };

      const joinResponse = await fetch(`http://localhost:5000/union/joinUnion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userUnionInfo }),
      });

      if (!joinResponse.ok) {
        throw new Error("Failed to join the union");
      }
      await handleMemberJoin(unionId, user?.uid)
      const userUnionsRes = await fetch(
        `http://localhost:5000/union/getUserUnions?userId=${user?.uid}`
      );

      if (!userUnionsRes.ok) {
        throw new Error("Failed to fetch user unions");
      }

      const userUnionsData = await userUnionsRes.json();
      dispatch(setUserUnions({ unions: userUnionsData.data }));

      setJoined("Survey submitted and union joined successfully!");
      router.push(`/search`);
    } catch (error) {
      console.error("Error submitting survey or joining union:", error);
      setError("Please fill out all questions provided.");
    }
  };

  const getDefaultImage = () => {
    const savedColors = JSON.parse(
      localStorage.getItem("unionColors") || "{}"
    );
    const backgroundColor = savedColors[unionData?.id] || "#ccc";

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
        {unionData?.name?.[0]?.toUpperCase()}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="join-union-page">
        {unionData ? (
          <>
            <div className="union-card">
              {unionData.image ? (
                <img
                  src={`http://localhost:5000${unionData.image}`}
                  alt={`${unionData.name} Logo`}
                  className="union-logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/Unionizer_Logo.png";
                  }}
                />
              ) : (
                getDefaultImage()
              )}
              <div className="union-info">
                <h3>{unionData.name}</h3>
                <p>{unionData.description}</p>
              </div>
            </div>
            <div className="questions-container">
              {questions.map((question, index) => (
                <div key={question.id} className="form-field">
                  <label>{question.questionText}</label>
                  <textarea
                    type="text"
                    placeholder="Aa"
                    value={answers[index]}
                    onChange={(e) =>
                      handleAnswerChange(index, e.target.value)
                    }
                    onInput={(e) => {
                      const textarea = e.target;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                  />
                </div>
              ))}
              <button className="submit-form-button" onClick={onSubmit}>
                Submit
              </button>
              {error ? error : null}
              {joined ? joined : null}
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
