"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import './joinunion.css';

const JoinUnion = () => {
  const { id } = useParams();
  const [unionData, setUnionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUnionData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/union/getUnion/${id}`);
          if (!response.ok) throw new Error('Failed to fetch union data');
          const data = await response.json();
          setUnionData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUnionData();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className="join-union-page">
        {unionData ? (
          <div>
            <div className="union-card">
              <img
                src={unionData.imageUrl || "https://via.placeholder.com/60"}
                alt="Union Logo"
              />
              <div className="union-info">
                <h1>{unionData.name}</h1>
                <p>{unionData.description}</p>
              </div>
            </div>
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
          </div>
        ) : (
          <p>No union data found.</p>
        )}
      </div>
    </Layout>
  );
};

export default JoinUnion;
