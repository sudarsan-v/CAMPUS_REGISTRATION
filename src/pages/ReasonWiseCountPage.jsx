import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './ReasonWiseCountPage.css';

const ReasonWiseCountPage = () => {
  const navigate = useNavigate();
  const [studentName] = useState('Mesuser Mes');
  const [packageName, setPackageName] = useState('SamplePackage');
  const [testName, setTestName] = useState('TEST-1');
  const [reportData, setReportData] = useState([]);

  const mockReportData = [
    {
      reason: 'Calculation Mistake',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Not focused on unit / structure / formulae',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Did not read question carefully and misinterpretation',
      chemistry: 0,
      physics: 0,
      maths: 1,
      total: 1
    },
    {
      reason: 'Confused by language of the question',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Not solved properly and tried to skip steps',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Required concept was not very clear',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Mixed two concepts / information',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Did not know the concept of the information',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Absent for the Session',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    },
    {
      reason: 'Other Reason',
      chemistry: 0,
      physics: 0,
      maths: 0,
      total: 0
    }
  ];

  useEffect(() => {
    if (!requireAuth(navigate)) return;
    setReportData(mockReportData);
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePackageChange = (e) => {
    setPackageName(e.target.value);
    // In real implementation, fetch new data based on package
  };

  const handleTestChange = (e) => {
    setTestName(e.target.value);
    // In real implementation, fetch new data based on test
  };

  return (
    <div className="reason-count-page">
      <div className="main-header">
        <div className="header-info">
          <span className="app-name">CITRINE</span>
          <div className="user-actions">
            <span className="welcome-text">👤 Welcome Mesuser Mes</span>
            <button className="logout-btn">🚪 Logout</button>
          </div>
        </div>
      </div>

      <div className="reason-count-content">
        <div className="page-header">
          <h2>Reason Wise Wrong Attempt Questions Count</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <div className="selection-form">
          <div className="form-row">
            <div className="form-group">
              <label>Student Name :</label>
              <span className="student-name">{studentName}</span>
            </div>

            <div className="form-group">
              <label>Package :</label>
              <select 
                value={packageName} 
                onChange={handlePackageChange}
                className="form-select"
              >
                <option value="SamplePackage">SamplePackage</option>
                <option value="Package1">Package1</option>
                <option value="Package2">Package2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Test Name :</label>
              <select 
                value={testName} 
                onChange={handleTestChange}
                className="form-select"
              >
                <option value="TEST-1">TEST-1</option>
                <option value="TEST-2">TEST-2</option>
              </select>
            </div>
          </div>
        </div>

        <div className="report-table-section">
          <table className="report-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>CHEMISTRY</th>
                <th>PHYSICS</th>
                <th>MATHS</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td className="reason-cell">{row.reason}</td>
                  <td className="count-cell">{row.chemistry}</td>
                  <td className="count-cell">{row.physics}</td>
                  <td className="count-cell">{row.maths}</td>
                  <td className="count-cell total-cell">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReasonWiseCountPage;
