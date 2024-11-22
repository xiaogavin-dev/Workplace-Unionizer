"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import './joinunion.css';

interface UnionData {
  name: string;
  description: string;
  imageUrl?: string;
}

const JoinUnion = () => {
  const { id: unionId } = useParams();  

  const [unionData, setUnionData] = useState<UnionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <button className="submit-button">Submit</button>
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
