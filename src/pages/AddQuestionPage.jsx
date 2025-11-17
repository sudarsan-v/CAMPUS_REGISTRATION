import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api-detailed.js';

function AddQuestionPage() {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Registration'); // Optional category
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Generate a unique ID (e.g., using timestamp + random number)
    const id = `Q${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newQuestion = {
      id,
      questionText,
      category,
      createdAt: new Date().toISOString(),
      active: true,
    };

    try {
      await axios.post(API_ENDPOINTS.QUESTIONS, newQuestion);
      setSuccess('Question added successfully!');
      setQuestionText(''); // Clear input
    } catch (err) {
      setError('Failed to add question. Please try again.');
      console.error('Error adding question:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Question</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Question Text:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            placeholder="Enter your question here"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          >
            <option value="Registration">Registration</option>
            <option value="Feedback">Feedback</option>
            <option value="General">General</option>
          </select>
        </div>
        <button
          type="submit"
          style={{ backgroundColor: '#007B9A', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AddQuestionPage;