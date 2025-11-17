import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './ProgressReportPage.css';

const ProgressReportPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check authentication and get user data
    if (!requireAuth(navigate)) return;
    
    const user = getCurrentUser();
    setUserData(user);
  }, [navigate]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="progress-report-page">
      <div className="progress-header">
        <div className="app-info">
          <h1>Meslova</h1>
          <span className="user-info">Mesuser</span>
        </div>
      </div>

      <div className="progress-content">
        <div className="page-header">
          <h2>Student Progress Report</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <div className="main-content">
          <div className="student-info-section">
            <div className="form-group">
              <label>Student ID:</label>
              <div className="student-id-display">
                {userData?.username || 'Loading...'}
              </div>
            </div>
          </div>

          <div className="coming-soon">
            <div className="coming-soon-content">
              <h3>Progress Report</h3>
              <p>This feature is coming soon...</p>
              <div className="placeholder-info">
                <p>Here you will be able to view:</p>
                <ul>
                  <li>Overall academic progress</li>
                  <li>Subject-wise performance trends</li>
                  <li>Improvement recommendations</li>
                  <li>Comparative analysis</li>
                  <li>Achievement milestones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportPage;
