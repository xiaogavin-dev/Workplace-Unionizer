"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import './joinunion.css';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { setUserUnions } from '@/lib/redux/features/user_unions/userUnionsSlice';
// import { createSymmetricKey, encryptSymmetricKeys } from '@/lib/util/encryptionCalls';
// import { join } from 'path';
import { handleMemberJoin } from '@/lib/util/handleKeyUpdates';
import { join } from 'path';
interface UnionData {
  id: string,
  name: string;
  description: string;
  imageUrl?: string;
}

const JoinUnion = () => {
  const { id: unionId } = useParams();

  const [unionData, setUnionData] = useState<UnionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (unionId) {
      console.log("Fetching data for union ID:", unionId);
      const fetchUnionData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/union/getUnion/${unionId}`);
          if (!response.ok) throw new Error('Failed to fetch union data');

          const data = await response.json();
          console.log("Fetched data:", data);
          setUnionData(data.data);
        } catch (err) {
          const error = err as Error;
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUnionData();
    } else {
      console.error("Union ID not found in URL.");
      setLoading(false);
    }
  }, [unionId]);
  const onSubmit = async () => {
    const joinUnion = async () => {
      try {
        // console.log(unionData)
        const userUnionInfo = {
          userId: user?.uid,
          unionId,
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
        await handleMemberJoin(unionData?.id, user?.uid)
        // console.log(responseData)
      } catch (error) {
        console.log("Issue joining union")
      }
      try {
        const userUnionsRes = await fetch(`http://localhost:5000/union/getUserUnions?userId=${user?.uid}`, {
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
    joinUnion()
  }
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
            <div className='questions-container'>
              <div className="form-field">
                <label>Which location do you work at?</label>
                <input type="text" placeholder="Aa" />
              </div>
              <div className="form-field">
                <label>What is your position?</label>
                <input type="text" placeholder="Aa" />
              </div>
              <div className="form-field">
                <label>Who is your manager?</label>
                <input type="text" placeholder="Aa" />
              </div>
              <div className="form-field">
                <label>What are other ways we can get in contact with you?</label>
                <input type="text" placeholder="Aa" />
              </div>
              <button className="submit-button" onClick={() => onSubmit()}>Submit</button>
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
