import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './QuestionPaperWeightagePage.css';

const QuestionPaperWeightagePage = () => {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [testName, setTestName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Mock data for packages and tests
  const packages = [
    { id: 1, name: 'SamplePackage' },
    { id: 2, name: 'JEE Main Package' },
    { id: 3, name: 'NEET Package' }
  ];

  const testsByPackage = {
    'SamplePackage': ['TEST-1', 'TEST-2'],
    'JEE Main Package': ['JEE Mock Test 1', 'JEE Mock Test 2'],
    'NEET Package': ['NEET Mock Test 1', 'NEET Mock Test 2']
  };

  // Mock weightage data
  const weightageData = [
    {
      section: 1,
      subject: 'MATHS',
      questionType: 'Single Correct',
      noOfQuestions: 5,
      individual: {
        correct: 1,
        wrong: 4,
        unattempted: 0
      },
      overallStudents: {
        correct: '[1]',
        wrong: '[4]',
        unattempted: '[0]'
      }
    },
    {
      section: 1,
      subject: 'MATHS',
      questionType: 'Total',
      noOfQuestions: 15,
      individual: {
        correct: 2,
        wrong: 12,
        unattempted: 1
      },
      overallStudents: {
        correct: '[2]',
        wrong: '[12]',
        unattempted: '[1]'
      }
    },
    {
      section: 2,
      subject: 'PHYSICS',
      questionType: 'Single Correct',
      noOfQuestions: 5,
      individual: {
        correct: 1,
        wrong: 3,
        unattempted: 1
      },
      overallStudents: {
        correct: '[1]',
        wrong: '[3]',
        unattempted: '[1]'
      }
    },
    {
      section: 2,
      subject: 'PHYSICS',
      questionType: 'Total',
      noOfQuestions: 10,
      individual: {
        correct: 1,
        wrong: 8,
        unattempted: 1
      },
      overallStudents: {
        correct: '[1]',
        wrong: '[8]',
        unattempted: '[1]'
      }
    },
    {
      section: 3,
      subject: 'CHEMISTRY',
      questionType: 'Single Correct',
      noOfQuestions: 5,
      individual: {
        correct: 0,
        wrong: 5,
        unattempted: 0
      },
      overallStudents: {
        correct: '[0]',
        wrong: '[5]',
        unattempted: '[0]'
      }
    },
    {
      section: 3,
      subject: 'CHEMISTRY',
      questionType: 'Total',
      noOfQuestions: 5,
      individual: {
        correct: 0,
        wrong: 5,
        unattempted: 0
      },
      overallStudents: {
        correct: '[0]',
        wrong: '[5]',
        unattempted: '[0]'
      }
    }
  ];

  useEffect(() => {
    if (!requireAuth(navigate)) return;
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePackageChange = (e) => {
    setPackageName(e.target.value);
    setTestName('');
  };

  const handleTestChange = (e) => {
    setTestName(e.target.value);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
  };

  // Filter data based on selected subject
  const getFilteredData = () => {
    if (!packageName || !testName) return [];

    if (selectedSubject === 'All') {
      return weightageData;
    }

    return weightageData.filter(item => item.subject === selectedSubject.toUpperCase());
  };

  const filteredData = getFilteredData();

  // Group data by section and calculate section totals
  const getGroupedData = () => {
    const grouped = {};
    
    filteredData.forEach(item => {
      const sectionKey = `section_${item.section}`;
      if (!grouped[sectionKey]) {
        grouped[sectionKey] = {
          section: item.section,
          subject: item.subject,
          rows: []
        };
      }
      grouped[sectionKey].rows.push(item);
    });

    return Object.values(grouped);
  };

  const groupedData = getGroupedData();

  return (
    <div className="weightage-page">
      <div className="weightage-header">
        <div className="app-info">
          <h1>Meslova</h1>
          <span className="user-info">Mesuser</span>
        </div>
      </div>

      <div className="weightage-content">
        <div className="page-header">
          <h2>Question Paper Weightage</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <div className="main-content">
          {/* Package and Test Selection */}
          <div className="selection-section">
            <div className="form-row">
              <div className="form-group">
                <label>Package</label>
                <select 
                  value={packageName} 
                  onChange={handlePackageChange}
                  className="form-select"
                >
                  <option value="">Select package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Test Name</label>
                <select 
                  value={testName} 
                  onChange={handleTestChange}
                  className="form-select"
                  disabled={!packageName}
                >
                  <option value="">Select Test</option>
                  {packageName && testsByPackage[packageName] && 
                    testsByPackage[packageName].map(test => (
                      <option key={test} value={test}>{test}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subject Filter and Table */}
          {packageName && testName && (
            <>
              {/* Subject Radio Buttons */}
              <div className="subject-section">
                <span className="subject-label">Subject</span>
                <div className="subject-options">
                  {['CHEMISTRY', 'PHYSICS', 'MATHS', 'All'].map(subject => (
                    <label key={subject} className="subject-option">
                      <input
                        type="radio"
                        name="subject"
                        checked={selectedSubject === subject}
                        onChange={() => handleSubjectChange(subject)}
                      />
                      <span>{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Weightage Table */}
              <div className="table-container">
                <table className="weightage-table">
                  <thead>
                    <tr>
                      <th rowSpan="2">SECTION</th>
                      <th rowSpan="2">QUESTION TYPE</th>
                      <th rowSpan="2">NO OF QSTNS.</th>
                      <th colSpan="3" className="individual-header">INDIVIDUAL</th>
                      <th colSpan="3" className="overall-header">OVERALL STUDENTS</th>
                    </tr>
                    <tr>
                      <th className="sub-header">CORRECT</th>
                      <th className="sub-header">WRONG</th>
                      <th className="sub-header">UNATTEMPTED</th>
                      <th className="sub-header">CORRECT</th>
                      <th className="sub-header">WRONG</th>
                      <th className="sub-header">UNATTEMPTED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.map((group, groupIndex) => (
                      group.rows.map((item, rowIndex) => (
                        <tr key={`${groupIndex}-${rowIndex}`} className={item.questionType === 'Total' ? 'total-row' : ''}>
                          {rowIndex === 0 && (
                            <td rowSpan={group.rows.length} className="section-cell">
                              {group.section}
                            </td>
                          )}
                          <td className="question-type-cell">
                            {item.questionType === 'Total' ? (
                              <strong>{item.subject}/{item.questionType}</strong>
                            ) : (
                              `${item.subject}/${item.questionType}`
                            )}
                          </td>
                          <td className="number-cell">{item.noOfQuestions}</td>
                          <td className="number-cell">{item.individual.correct}</td>
                          <td className="number-cell">{item.individual.wrong}</td>
                          <td className="number-cell">{item.individual.unattempted}</td>
                          <td className="bracket-cell">{item.overallStudents.correct}</td>
                          <td className="bracket-cell">{item.overallStudents.wrong}</td>
                          <td className="bracket-cell">{item.overallStudents.unattempted}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {(!packageName || !testName) && (
            <div className="no-selection">
              <p>Please select a package and test to view weightage data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperWeightagePage;
