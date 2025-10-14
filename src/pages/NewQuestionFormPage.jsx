import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewQuestionFormPage() {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Registration');
  const [difficulty, setDifficulty] = useState('Easy');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!questionText.trim()) {
      setError('Question text is required.');
      return;
    }

    const id = `Q${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newQuestion = {
      id,
      questionText: questionText.trim(),
      category,
      difficulty,
      createdAt: new Date().toISOString(),
      active: true,
    };

    try {
      const response = await axios.post(
        'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/questions',
        newQuestion
      );
      if (response.status === 201) {
        setSuccess('Question added successfully!');
        setQuestionText('');
        setTimeout(() => navigate('/question-entry'), 2000); // Return after 2 seconds
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question. Please try again.');
      console.error('Error adding question:', err);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2 style={{ color: '#005F73', textAlign: 'center' }}>New Question Form</h2>
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Question Text:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              boxSizing: 'border-box' 
            }}
            placeholder="Enter your question here"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              backgroundColor: 'white' 
            }}
          >
            <option value="Registration">Registration</option>
            <option value="Feedback">Feedback</option>
            <option value="General">General</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              backgroundColor: 'white' 
            }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          style={{ 
            backgroundColor: '#005F73', 
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '16px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#004d61')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#005F73')}
        >
          Save Question
        </button>
      </form>
    </div>
  );
}

export default NewQuestionFormPage;