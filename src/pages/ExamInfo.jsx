import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamInfo = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock test data - replace with actual API call
  const mockTestData = {
    1: {
      course: 'JEE MAIN',
      package: 'Samplepackage',
      questions: 10,
      duration: '10mins',
      testDate: '25/06/2025',
      testName: 'TEST-2',
      subjects: ['CHEMISTRY', 'PHYSICS', 'MATHS'],
      status: 'complete', // or 'ready', 'pending'
      instructions: [
        'Read all questions carefully before answering.',
        'Each question carries equal marks.',
        'There is no negative marking.',
        'You can navigate between questions using the navigation panel.',
        'Submit the test only when you are sure about all answers.',
        'Do not refresh the browser during the test.',
        'Make sure you have a stable internet connection.',
      ]
    },
    // Add more test data as needed
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockTestData[testId];
      if (data) {
        setTestInfo(data);
      }
      setLoading(false);
    }, 500);
  }, [testId]);

  const handleStartTest = () => {
    if (testInfo?.status === 'complete') {
      alert('This test is already complete.');
      return;
    }
    // Navigate to actual test taking page
    navigate(`/test/${testId}/questions`);
  };

  const handleGoBack = () => {
    navigate('/take-test');
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#5ec4e3', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading test information...</div>
      </div>
    );
  }

  if (!testInfo) {
    return (
      <div style={{ 
        backgroundColor: '#5ec4e3', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Test not found.</div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#5ec4e3', 
      minHeight: '100vh', 
      padding: '0',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#5ec4e3',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Meslova</h1>
        <span style={{ fontSize: '16px' }}>Mesuser</span>
      </header>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        margin: '20px',
        borderRadius: '8px',
        padding: '0',
        minHeight: 'calc(100vh - 100px)',
        overflow: 'hidden'
      }}>
        {/* Exam Info Header */}
        <div style={{
          backgroundColor: '#5ec4e3',
          color: 'white',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            ℹ
          </div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Exam Info & Instructions</h2>
        </div>

        {/* Test Information Grid */}
        <div style={{
          padding: '30px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px 60px',
          backgroundColor: '#f8f9fa',
          margin: '0',
          borderBottom: '1px solid #ddd'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Course :</span>
            <span style={{ color: '#666' }}>{testInfo.course}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Package :</span>
            <span style={{ color: '#666' }}>{testInfo.package}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>No.of Questions :</span>
            <span style={{ color: '#666' }}>{testInfo.questions}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Exam Duration :</span>
            <span style={{ color: '#666' }}>{testInfo.duration}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Test Date :</span>
            <span style={{ color: '#666' }}>{testInfo.testDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Test Name :</span>
            <span style={{ color: '#666' }}>{testInfo.testName}</span>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Subject(s) Mapped :</span>
            <span style={{ color: '#666' }}>{testInfo.subjects.join('   ')}</span>
          </div>
        </div>

        {/* Status and Button Section */}
        <div style={{
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {testInfo.status === 'complete' ? (
              <p style={{ 
                fontSize: '18px', 
                color: '#dc3545', 
                margin: 0,
                fontWeight: 'bold' 
              }}>
                This test is complete.
              </p>
            ) : (
              <p style={{ 
                fontSize: '18px', 
                color: '#28a745', 
                margin: 0,
                fontWeight: 'bold' 
              }}>
                You can start this test now.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleGoBack}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Back
            </button>
            
            <button
              onClick={handleStartTest}
              style={{
                background: 'linear-gradient(45deg, #5ec4e3, #3a9bc1)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: testInfo.status === 'complete' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: testInfo.status === 'complete' ? 0.6 : 1
              }}
            >
              CLICK HERE
              <span style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                »
              </span>
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        {testInfo.instructions && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderTop: '1px solid #ddd'
          }}>
            <h3 style={{ 
              marginBottom: '20px', 
              color: '#333',
              fontSize: '20px'
            }}>
              Test Instructions:
            </h3>
            <ul style={{
              listStyleType: 'decimal',
              paddingLeft: '25px',
              lineHeight: '1.8'
            }}>
              {testInfo.instructions.map((instruction, index) => (
                <li key={index} style={{
                  marginBottom: '8px',
                  color: '#555',
                  fontSize: '16px'
                }}>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamInfo;