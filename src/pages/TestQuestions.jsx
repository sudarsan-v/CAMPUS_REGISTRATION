import React from 'react';
import { useParams } from 'react-router-dom';

const TestQuestions = () => {
  const { testId } = useParams();
  
  return (
    <div style={{ 
      backgroundColor: '#5ec4e3', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '50px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Test Questions Page</h2>
        <p>Test ID: {testId}</p>
        <p>This is where the actual test questions will be displayed.</p>
      </div>
    </div>
  );
};

export default TestQuestions;