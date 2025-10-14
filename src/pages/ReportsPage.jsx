import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, PieChart, LineChart } from '../components/Charts';
import { getCurrentUser, requireAuth, getUserId } from '../utils/auth';

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check authentication and get user data
    if (requireAuth()) {
      const user = getCurrentUser();
      setUserData(user);
    }
  }, []);

  const reportTypes = [
    {
      id: 'cumulative-performance',
      title: 'Cumulative Performance', 
      icon: '📊',
      color: '#4CAF50',
      description: 'Overall performance analysis'
    },
    {
      id: 'error-list',
      title: 'Error List',
      icon: '❌', 
      color: '#F44336',
      description: 'Common mistakes and errors'
    },
    {
      id: 'question-review',
      title: 'Question Review',
      icon: '❓',
      color: '#2196F3',
      description: 'Questions reviewed and pending'
    },
    {
      id: 'practice-wrong',
      title: 'Practice on Wrong Unattempted Questions',
      icon: '📝',
      color: '#FF9800',
      description: 'Focus on incorrect answers'
    },
    {
      id: 'time-analysis',
      title: 'Time Taken',
      icon: '⏰',
      color: '#9C27B0',
      description: 'Time analysis and patterns'
    },
    {
      id: 'question-paper-weightage',
      title: 'Question Paper Weightage',
      icon: '📋',
      color: '#607D8B',
      description: 'Weightage and marks distribution'
    }
  ];

  const fetchReportData = async (reportType) => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/reports/${reportType}/${userId}`
      );
      
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        console.error('Failed to fetch report data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (reportType) => {
    setSelectedReport(reportType);
    fetchReportData(reportType);
  };

  const renderReportDetails = () => {
    if (!selectedReport || !reportData) return null;

    switch (selectedReport) {
      case 'cumulative-performance':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Cumulative Performance Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Total Tests</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{reportData.totalTests}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Average Score</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{reportData.averageScore}%</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Accuracy</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>{reportData.accuracy}%</p>
              </div>
            </div>
            <div>
              <LineChart 
                data={reportData.monthlyData.map(month => ({
                  label: month.month,
                  value: month.score
                }))}
                title="Monthly Progress Trend"
              />
              <BarChart 
                data={reportData.monthlyData.map(month => ({
                  label: month.month,
                  value: month.tests,
                  color: '#2196F3'
                }))}
                title="Tests Taken Per Month"
              />
            </div>
          </div>
        );

      case 'error-list':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Error Analysis</h3>
            <div style={{ marginBottom: '20px' }}>
              <h4>Total Errors: <span style={{ color: '#F44336' }}>{reportData.totalErrors}</span></h4>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <PieChart 
                data={reportData.errorsBySubject.map((subject, index) => ({
                  label: subject.subject,
                  value: subject.errors,
                  color: ['#F44336', '#FF9800', '#4CAF50'][index % 3]
                }))}
                title="Errors by Subject Distribution"
              />
            </div>
            <div>
              <h4>Common Error Topics</h4>
              {reportData.commonErrors.map((error, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span>{error.topic}</span>
                  <span>{error.errors} errors</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'question-review':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Question Review Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Reviewed</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{reportData.totalQuestionsReviewed}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Pending</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>{reportData.pendingReview}</p>
              </div>
            </div>
            <div>
              <h4>Review by Difficulty</h4>
              {reportData.reviewsByDifficulty.map((level, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span>{level.difficulty}</span>
                  <span>Reviewed: {level.reviewed} | Pending: {level.pending}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'practice-wrong':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Practice on Wrong & Unattempted Questions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Wrong Questions</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>{reportData.totalWrongQuestions}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Unattempted</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>{reportData.unattemptedQuestions}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Practice Sessions</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{reportData.practiceSessionsCompleted}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Improvement Rate</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{reportData.improvementRate}%</p>
              </div>
            </div>
            <div>
              <h4>Subject-wise Breakdown</h4>
              {reportData.subjectWiseWrong.map((subject, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span>{subject.subject}</span>
                  <span>Wrong: {subject.wrong} | Unattempted: {subject.unattempted}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'time-analysis':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Time Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Total Time</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>{reportData.totalTimeSpent}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Avg per Question</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{reportData.averageTimePerQuestion}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Fastest Test</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{reportData.fastestTest}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Slowest Test</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>{reportData.slowestTest}</p>
              </div>
            </div>
            <div>
              <h4>Time by Subject</h4>
              {reportData.timeBySubject.map((subject, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span>{subject.subject}</span>
                  <span>Total: {subject.totalTime} | Avg: {subject.avgPerQuestion}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'question-paper-weightage':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Question Paper Weightage Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Total Marks</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#607D8B' }}>{reportData.totalMarks}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Marks Obtained</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{reportData.marksObtained}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h4>Percentage</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{reportData.percentage}%</p>
              </div>
            </div>
            <div>
              <h4>Subject-wise Performance</h4>
              {reportData.subjectWeightage.map((subject, index) => (
                <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>{subject.subject}</span>
                    <span>{subject.obtained}/{subject.totalMarks} ({subject.percentage}%)</span>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    {subject.topicWise.map((topic, topicIndex) => (
                      <div key={topicIndex} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <span>{topic.topic}</span>
                        <span>{topic.obtained}/{topic.marks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        padding: '30px',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <h2 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>Reports</h2>

        {!selectedReport && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {reportTypes.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report.id)}
                style={{
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  e.target.style.borderColor = report.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = '#e0e0e0';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                  color: report.color
                }}>
                  {report.icon}
                </div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '18px',
                  color: '#333',
                  fontWeight: 'bold'
                }}>
                  {report.title}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {report.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedReport && (
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setReportData(null);
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  marginRight: '20px'
                }}
              >
                ← Back to Reports
              </button>
              <h3 style={{ margin: 0, color: '#333' }}>
                {reportTypes.find(r => r.id === selectedReport)?.title}
              </h3>
            </div>

            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px', 
                fontSize: '18px' 
              }}>
                Loading report data...
              </div>
            ) : (
              <div style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {renderReportDetails()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
