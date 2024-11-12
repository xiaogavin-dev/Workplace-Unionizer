"use client";
import React, { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks/redux';
import { useRouter } from 'next/navigation';
import './formUnion.css';

const AddUnionForm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('union');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAppSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous message

    // Check for empty fields
    if (!name || !location || !status || !organization) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {

      let userId = user?.uid
      const response = await fetch('http://localhost:5000/union/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location, status, organization, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Union successfully added to the database!');
        setName('');
        setLocation('');
        setStatus('union');
        setOrganization('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="union">Union</option>
          <option value="pending">Pending</option>
        </select>
        <input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Organization"
        />
        <button type="submit">Add Union</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AddUnionForm;
