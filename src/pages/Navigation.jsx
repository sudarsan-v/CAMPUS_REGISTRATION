import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value === 'solution-entry') {
      navigate('/solution-entry');
    } else if (value === 'question-change') {
      navigate('/question-change');
    } else if (value === 'paragraph-modification') {
      navigate('/paragraph-modification');
    } else if (value === 'add-question') {
      navigate('/add-question');
    } else if (value === 'question-modification') {
      navigate('/question-modification');
    } else if (value === 'add-paragraph') {
      navigate('/add-paragraph');
    }
  };

  return (
    <div style={{ backgroundColor: '#00A8CC', padding: '10px', display: 'flex', justifyContent: 'space-around', color: 'white', alignItems: 'center' }}>
      <select style={{ marginRight: '10px' }}>
        <option>Campus Registration</option>
      </select>
      <select style={{ marginRight: '10px' }}>
        <option>Test</option>
      </select>
      <select style={{ marginRight: '10px' }}>
        <option>Admin Reports</option>
      </select>
      <select value={selectedOption} onChange={handleOptionChange} style={{ marginRight: '10px' }}>
        <option value="">Select an Option</option>
        {/* {questions.map((question) => (
          <option key={question.id} value={question.id}>
            {question.questionText}
          </option>
        ))} */}
        <option value="add-question">Add Question</option>
        <option value="question-modification">Question Modification</option>
        <option value="add-paragraph">Add Paragraph</option>
        <option value="paragraph-modification">Paragraph Modification</option>
        <option value="solution-entry">Solution Entry</option>
        <option value="question-change">Question Change</option>
      </select>
    </div>
  );
}

export default Navigation;