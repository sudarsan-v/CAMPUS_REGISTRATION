import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './ReasonsForWrongAttemptPage.css';

const ReasonsForWrongAttemptPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [packageName, setPackageName] = useState('SamplePackage');
  const [testName, setTestName] = useState('TEST-1');
  const [selectedReason, setSelectedReason] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({
    qNo: null,
    subject: '',
    question: '',
    status: 'WRONG'
  });

  const mockQuestions = {
    2: {
      qNo: 2,
      subject: 'MATHS',
      question: 'At present, a firm is manufacturing 2000 items. It is estimated that the rate of change of production P w.r.t. additional number of workers x is given by dp/dx = 100 - 12√x. If the firm employs 25 more workers, then the new level of production of items is:',
      status: 'WRONG'
    },
    3: {
      qNo: 3,
      subject: 'MATHS',
      question: 'Find the value of ∫₀¹ x² dx using fundamental theorem of calculus.',
      status: 'WRONG'
    },
    4: {
      qNo: 4,
      subject: 'MATHS',
      question: 'Solve the differential equation dy/dx + y = ex.',
      status: 'WRONG'
    },
    5: {
      qNo: 5,
      subject: 'MATHS',
      question: 'Find the area bounded by the curve y = x² and the line y = 4.',
      status: 'WRONG'
    },
    7: {
      qNo: 7,
      subject: 'PHYSICS',
      question: 'A particle moves in a circle of radius R with constant angular velocity ω. Find the centripetal acceleration.',
      status: 'WRONG'
    }
  };

  const reasonOptions = [
    'Calculation Mistake',
    'Not focused on unit / structure / formulae',
    'Did not read question carefully and misinterpretation',
    'Confused by language of the question',
    'Not solved properly and tried to skip steps',
    'Required concept was not very clear',
    'Mixed two concepts / information',
    'Did not know the concept of the information',
    'Absent for the session',
    'Other Reason'
  ];

  useEffect(() => {
    if (!requireAuth(navigate)) return;
    
    // Load question based on questionId from URL params
    if (questionId && mockQuestions[questionId]) {
      setCurrentQuestion(mockQuestions[questionId]);
    } else {
      // Default to first question if no valid ID
      setCurrentQuestion(mockQuestions[2]);
    }
  }, [navigate, questionId]);

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
  };

  const handleViewReport = () => {
    // Navigate to reason wise count page
    navigate('/reason-wise-count');
  };

  const handlePrevious = () => {
    const questionIds = Object.keys(mockQuestions).map(Number).sort((a, b) => a - b);
    const currentIndex = questionIds.indexOf(currentQuestion.qNo);
    if (currentIndex > 0) {
      const prevQuestionId = questionIds[currentIndex - 1];
      setCurrentQuestion(mockQuestions[prevQuestionId]);
      navigate(`/reasons-wrong-attempt/${prevQuestionId}`, { replace: true });
    }
  };

  const handleNext = () => {
    const questionIds = Object.keys(mockQuestions).map(Number).sort((a, b) => a - b);
    const currentIndex = questionIds.indexOf(currentQuestion.qNo);
    if (currentIndex < questionIds.length - 1) {
      const nextQuestionId = questionIds[currentIndex + 1];
      setCurrentQuestion(mockQuestions[nextQuestionId]);
      navigate(`/reasons-wrong-attempt/${nextQuestionId}`, { replace: true });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="reasons-page">
      <div className="reasons-header">
        <div className="app-info">
          <h1>Meslova</h1>
          <span className="user-info">Mesuser</span>
        </div>
      </div>

      <div className="reasons-content">
        <div className="page-header">
          <h2>REASONS FOR WRONG ATTEMPT</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <div className="main-content">
          <div className="selection-section">
            <div className="form-row">
              <div className="form-group">
                <label>Package Name</label>
                <select 
                  value={packageName} 
                  onChange={(e) => setPackageName(e.target.value)}
                  className="form-select"
                >
                  <option value="SamplePackage">SamplePackage</option>
                  <option value="Package1">Package1</option>
                  <option value="Package2">Package2</option>
                </select>
              </div>

              <div className="form-group">
                <label>Test Name</label>
                <select 
                  value={testName} 
                  onChange={(e) => setTestName(e.target.value)}
                  className="form-select"
                >
                  <option value="TEST-1">TEST-1</option>
                  <option value="TEST-2">TEST-2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="content-row">
            <div className="question-section">
              <div className="question-header">
                <div className="question-info">
                  <div className="q-details">
                    <span className="q-label">Q.NO :</span>
                    <span className="q-number">{currentQuestion.qNo || '--'}</span>
                  </div>
                  <div className="subject-info">
                    <span className="subject-label">SUBJECT :</span>
                    <span className="subject-name">{currentQuestion.subject || '--'}</span>
                  </div>
                </div>
                <div className="status-indicators">
                  <span className="status-wrong">● WRONG</span>
                  <span className="status-correct">● CORRECT</span>
                </div>
              </div>

              {currentQuestion.question && (
                <div className="question-content">
                  <div className="question-label">Question</div>
                  <div className="question-text">
                    {currentQuestion.question}
                  </div>
                </div>
              )}

              {!currentQuestion.question && (
                <div className="no-question">
                  <p>Please select a package and test to view question details.</p>
                </div>
              )}
            </div>

            <div className="status-section">
              <h3>Status Updation</h3>
              <div className="reason-options">
                {reasonOptions.map((reason, index) => (
                  <label key={index} className="reason-option">
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => handleReasonChange(reason)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <button 
                className="view-report-btn"
                onClick={handleViewReport}
                disabled={!selectedReason}
              >
                View Report
              </button>
            </div>
          </div>

          <div className="navigation-buttons">
            <div className="question-indicator">
              Question {currentQuestion.qNo || 0} of 5
            </div>
            <div className="nav-controls">
              <button 
                className="nav-btn previous-btn" 
                onClick={handlePrevious}
                disabled={currentQuestion.qNo === 2}
              >
                PREVIOUS
              </button>
              <button 
                className="nav-btn next-btn" 
                onClick={handleNext}
                disabled={currentQuestion.qNo === 7}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReasonsForWrongAttemptPage;
