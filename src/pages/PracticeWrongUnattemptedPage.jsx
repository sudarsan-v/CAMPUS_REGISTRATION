import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './PracticeWrongUnattemptedPage.css';

const PracticeWrongUnattemptedPage = () => {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [testName, setTestName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // Mock data for subject-wise breakdown
  const subjectData = [
    { subject: 'MATHS', wrong: 4, unattempted: 0, total: 4 },
    { subject: 'PHYSICS', wrong: 3, unattempted: 1, total: 4 },
    { subject: 'CHEMISTRY', wrong: 5, unattempted: 0, total: 5 }
  ];

  // Mock questions data
  const questionsData = [
    {
      qNo: 2,
      subject: 'MATHS',
      status: 'WRONG',
      question: 'At present, a firm is manufacturing 2000 items. It is estimated that the rate of change of production P w.r.t. additional number of workers x is given by dp/dx = 100 - 12√x. If the firm employs 25 more workers, then the new level of production of items is:',
      answerChoices: ['2500', '3000', '2800', '3200']
    },
    {
      qNo: 3,
      subject: 'MATHS',
      status: 'WRONG',
      question: 'Find the value of ∫₀¹ x² dx using fundamental theorem of calculus.',
      answerChoices: ['1/3', '1/2', '2/3', '1']
    },
    {
      qNo: 4,
      subject: 'PHYSICS',
      status: 'UNATTEMPTED',
      question: 'A particle moves in a circle of radius R with constant angular velocity ω. Find the centripetal acceleration.',
      answerChoices: ['ωR', 'ω²R', 'ωR²', 'ω²R²']
    },
    {
      qNo: 5,
      subject: 'CHEMISTRY',
      status: 'WRONG',
      question: 'What is the molecular formula of benzene?',
      answerChoices: ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₆H₁₀']
    }
  ];

  const totalStats = {
    wrong: subjectData.reduce((sum, subject) => sum + subject.wrong, 0),
    unattempted: subjectData.reduce((sum, subject) => sum + subject.unattempted, 0),
    total: subjectData.reduce((sum, subject) => sum + subject.total, 0)
  };

  useEffect(() => {
    if (!requireAuth(navigate)) return;
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setSelectedQuestionId(null);
  };

  const getFilteredQuestions = () => {
    if (selectedStatus === 'ALL') return questionsData;
    return questionsData.filter(q => q.status === selectedStatus);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestionId(questionId);
  };

  const selectedQuestion = questionsData.find(q => q.qNo === selectedQuestionId);

  return (
    <div className="practice-page">
      <div className="practice-header">
        <div className="app-info">
          <h1>Meslova</h1>
          <span className="user-info">Mesuser</span>
        </div>
      </div>

      <div className="practice-content">
        <div className="page-header">
          <h2>PRACTICE WRONG,UNATTEMPTED QUESTIONS</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <div className="main-content">
          {/* Package and Test Selection */}
          <div className="selection-section">
            <div className="form-row">
              <div className="form-group">
                <label>Package :</label>
                <select 
                  value={packageName} 
                  onChange={(e) => setPackageName(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select package</option>
                  <option value="SamplePackage">SamplePackage</option>
                  <option value="Package1">Package1</option>
                  <option value="Package2">Package2</option>
                </select>
              </div>

              <div className="form-group">
                <label>Test Name :</label>
                <select 
                  value={testName} 
                  onChange={(e) => setTestName(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Test</option>
                  <option value="TEST-1">TEST-1</option>
                  <option value="TEST-2">TEST-2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subject Statistics Table */}
          {packageName && testName && (
            <>
              <div className="stats-table">
                <table>
                  <thead>
                    <tr>
                      <th>SUBJECT</th>
                      <th>WRONG</th>
                      <th>UN-ATTEMPT</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.subject}</td>
                        <td>{subject.wrong}</td>
                        <td>{subject.unattempted}</td>
                        <td>{subject.total}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td><strong>Total</strong></td>
                      <td><strong>{totalStats.wrong}</strong></td>
                      <td><strong>{totalStats.unattempted}</strong></td>
                      <td><strong>{totalStats.total}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Selection */}
              <div className="status-selection">
                <span className="status-label">STATUS :</span>
                <div className="status-options">
                  <label className="status-option">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'WRONG'}
                      onChange={() => handleStatusChange('WRONG')}
                    />
                    <span>WRONG</span>
                  </label>
                  <label className="status-option">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'UNATTEMPTED'}
                      onChange={() => handleStatusChange('UNATTEMPTED')}
                    />
                    <span>UNATTEMPTED</span>
                  </label>
                  <label className="status-option">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'ALL'}
                      onChange={() => handleStatusChange('ALL')}
                    />
                    <span>ALL</span>
                  </label>
                </div>
              </div>

              {/* Question Display Section */}
              <div className="question-display">
                {!selectedQuestionId ? (
                  <div className="question-list">
                    <div className="question-header-display">
                      <span>Q.NO:</span>
                      <span>SUBJECT:</span>
                      <span>STATUS :</span>
                    </div>
                    <div className="questions-grid">
                      {getFilteredQuestions().map((question) => (
                        <div 
                          key={question.qNo}
                          className="question-item"
                          onClick={() => handleQuestionSelect(question.qNo)}
                        >
                          <span className="q-number">{question.qNo}</span>
                          <span className="q-subject">{question.subject}</span>
                          <span className={`q-status ${question.status.toLowerCase()}`}>
                            {question.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="selected-question">
                    <div className="question-header-info">
                      <div className="question-details">
                        <span>Q.NO: {selectedQuestion.qNo}</span>
                        <span>SUBJECT: {selectedQuestion.subject}</span>
                        <span>STATUS: {selectedQuestion.status}</span>
                      </div>
                      <button 
                        className="back-to-list-btn"
                        onClick={() => setSelectedQuestionId(null)}
                      >
                        Back to List
                      </button>
                    </div>
                    
                    <div className="question-content">
                      <p>{selectedQuestion.question}</p>
                      
                      {selectedQuestion.answerChoices && (
                        <div className="answer-choices">
                          <h4>Answer Choices</h4>
                          {selectedQuestion.answerChoices.map((choice, index) => (
                            <div key={index} className="choice-option">
                              <input type="radio" name="answer" id={`choice-${index}`} />
                              <label htmlFor={`choice-${index}`}>{choice}</label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="action-buttons">
                        <button className="submit-btn">Submit Answer</button>
                        <button className="skip-btn">Skip Question</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {(!packageName || !testName) && (
            <div className="no-selection">
              <p>Please select a package and test to view practice questions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeWrongUnattemptedPage;
