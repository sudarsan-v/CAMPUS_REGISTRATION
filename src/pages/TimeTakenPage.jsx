import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import './TimeTakenPage.css';

const TimeTakenPage = () => {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [testName, setTestName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('qno');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  // Mock data for time taken
  const timeData = [
    {
      qNo: 1,
      subject: 'MATHS',
      mainTopic: 'JEEMAIN-XII MATHS',
      topic: 'JEEMAIN-XII MATHS',
      status: 'Correct',
      timeTaken: 1.25,
      question: 'Find the derivative of x² + 3x + 2',
      solution: 'The derivative is 2x + 3',
      keyAnswer: 'A',
      yourAnswer: 'A'
    },
    {
      qNo: 2,
      subject: 'MATHS',
      mainTopic: 'JEEMAIN-XII MATHS',
      topic: 'JEEMAIN-XII MATHS',
      status: 'Incorrect',
      timeTaken: 0.18,
      question: 'Solve the integral ∫x² dx',
      solution: 'The integral is (x³/3) + C',
      keyAnswer: 'C',
      yourAnswer: 'B'
    },
    {
      qNo: 3,
      subject: 'MATHS',
      mainTopic: 'JEEMAIN XII MATHS',
      topic: 'JEEMAIN-XII MATHS',
      status: 'Incorrect',
      timeTaken: 0.37,
      question: 'Find the limit of (sin x)/x as x approaches 0',
      solution: 'The limit is 1',
      keyAnswer: 'B',
      yourAnswer: 'C'
    },
    {
      qNo: 4,
      subject: 'MATHS',
      mainTopic: 'JEEMAIN-XII MATHS',
      topic: 'JEEMAIN-XII MATHS',
      status: 'Incorrect',
      timeTaken: 0.15,
      question: 'Calculate the area under y = x² from x = 0 to x = 2',
      solution: 'Area = ∫₀² x² dx = [x³/3]₀² = 8/3',
      keyAnswer: 'D',
      yourAnswer: 'A'
    },
    {
      qNo: 5,
      subject: 'MATHS',
      mainTopic: 'JEEMAIN-XII MATHS',
      topic: 'JEEMAIN-XII MATHS',
      status: 'Incorrect',
      timeTaken: 1.12,
      question: 'Determine the equation of tangent to y = x³ at x = 1',
      solution: 'y - 1 = 3(x - 1), so y = 3x - 2',
      keyAnswer: 'A',
      yourAnswer: 'B'
    },
    {
      qNo: 6,
      subject: 'PHYSICS',
      mainTopic: 'JEEMAIN-XII PHYSICS',
      topic: 'JEEMAIN-XII PHYSICS',
      status: 'Correct',
      timeTaken: 0.25,
      question: 'Calculate the force on a charge of 2C in an electric field of 5 N/C',
      solution: 'F = qE = 2 × 5 = 10 N',
      keyAnswer: 'B',
      yourAnswer: 'B'
    },
    {
      qNo: 7,
      subject: 'PHYSICS',
      mainTopic: 'JEEMAIN-XII PHYSICS',
      topic: 'JEEMAIN-XII PHYSICS',
      status: 'Incorrect',
      timeTaken: 0.07,
      question: 'Find the acceleration due to gravity at height h above Earth',
      solution: 'g\' = g(R/(R+h))²',
      keyAnswer: 'C',
      yourAnswer: 'A'
    },
    {
      qNo: 8,
      subject: 'PHYSICS',
      mainTopic: 'JEEMAIN-XII PHYSICS',
      topic: 'JEEMAIN-XII PHYSICS',
      status: 'Incorrect',
      timeTaken: 0.07,
      question: 'Calculate the wavelength of light with frequency 5 × 10¹⁴ Hz',
      solution: 'λ = c/f = 3×10⁸/(5×10¹⁴) = 6×10⁻⁷ m',
      keyAnswer: 'A',
      yourAnswer: 'D'
    },
    {
      qNo: 9,
      subject: 'PHYSICS',
      mainTopic: 'JEEMAIN-XII PHYSICS',
      topic: 'JEEMAIN-XII PHYSICS',
      status: 'Unattempted',
      timeTaken: 8.62,
      question: 'Derive the formula for escape velocity from Earth',
      solution: 'v = √(2gR) = √(2GM/R)',
      keyAnswer: 'B',
      yourAnswer: null
    },
    {
      qNo: 10,
      subject: 'PHYSICS',
      mainTopic: 'JEEMAIN-XII PHYSICS',
      topic: 'JEEMAIN-XII PHYSICS',
      status: 'Incorrect',
      timeTaken: 0.12,
      question: 'Calculate the magnetic field at the center of a circular loop',
      solution: 'B = μ₀I/(2R)',
      keyAnswer: 'C',
      yourAnswer: 'A'
    },
    {
      qNo: 11,
      subject: 'CHEMISTRY',
      mainTopic: 'JEEMAIN-XII CHEMISTRY',
      topic: 'JEEMAIN-XII CHEMISTRY',
      status: 'Correct',
      timeTaken: 1.45,
      question: 'What is the molecular formula of benzene?',
      solution: 'Benzene has the molecular formula C₆H₆',
      keyAnswer: 'A',
      yourAnswer: 'A'
    },
    {
      qNo: 12,
      subject: 'CHEMISTRY',
      mainTopic: 'JEEMAIN-XII CHEMISTRY',
      topic: 'JEEMAIN-XII CHEMISTRY',
      status: 'Incorrect',
      timeTaken: 0.33,
      question: 'Identify the hybridization of carbon in methane',
      solution: 'Carbon in CH₄ is sp³ hybridized',
      keyAnswer: 'C',
      yourAnswer: 'B'
    },
    {
      qNo: 13,
      subject: 'CHEMISTRY',
      mainTopic: 'JEEMAIN-XII CHEMISTRY',
      topic: 'JEEMAIN-XII CHEMISTRY',
      status: 'Correct',
      timeTaken: 2.15,
      question: 'Calculate the pH of 0.1 M HCl solution',
      solution: 'pH = -log[H⁺] = -log(0.1) = 1',
      keyAnswer: 'B',
      yourAnswer: 'B'
    },
    {
      qNo: 14,
      subject: 'CHEMISTRY',
      mainTopic: 'JEEMAIN-XII CHEMISTRY',
      topic: 'JEEMAIN-XII CHEMISTRY',
      status: 'Incorrect',
      timeTaken: 0.28,
      question: 'Name the process of conversion of alkane to alkene',
      solution: 'The process is called dehydrogenation or cracking',
      keyAnswer: 'D',
      yourAnswer: 'A'
    },
    {
      qNo: 15,
      subject: 'CHEMISTRY',
      mainTopic: 'JEEMAIN-XII CHEMISTRY',
      topic: 'JEEMAIN-XII CHEMISTRY',
      status: 'Unattempted',
      timeTaken: 0.00,
      question: 'Determine the oxidation state of chromium in K₂Cr₂O₇',
      solution: 'Oxidation state of Cr is +6',
      keyAnswer: 'A',
      yourAnswer: null
    }
  ];

  useEffect(() => {
    if (!requireAuth(navigate)) return;
  }, [navigate]);

  // Filter and sort data
  const getFilteredData = () => {
    if (!packageName || !testName) return [];

    let filtered = [...timeData];

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(item => item.subject === selectedSubject);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mainTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'qno':
          compareValue = a.qNo - b.qNo;
          break;
        case 'subject':
          compareValue = a.subject.localeCompare(b.subject);
          break;
        case 'mainTopic':
          compareValue = a.mainTopic.localeCompare(b.mainTopic);
          break;
        case 'topic':
          compareValue = a.topic.localeCompare(b.topic);
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
        case 'timeTaken':
          compareValue = a.timeTaken - b.timeTaken;
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePackageChange = (e) => {
    setPackageName(e.target.value);
    setTestName('');
    setCurrentPage(1);
  };

  const handleTestChange = (e) => {
    setTestName(e.target.value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Correct':
        return '#28a745';
      case 'Incorrect':
        return '#dc3545';
      case 'Unattempted':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="time-taken-page">
      <div className="time-taken-header">
        <div className="app-info">
          <h1>Meslova</h1>
          <span className="user-info">Mesuser</span>
        </div>
      </div>

      <div className="time-taken-content">
        <div className="page-header">
          <h2>EACH QUESTION TIME TAKEN LIST</h2>
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
                <label>Test Name :</label>
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
                  {['MATHS', 'PHYSICS', 'CHEMISTRY', 'All'].map(subject => (
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

              {/* Controls */}
              <div className="table-controls">
                <div className="entries-control">
                  <span>Show </span>
                  <select 
                    value={entriesPerPage} 
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="entries-select"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span> entries</span>
                </div>

                <div className="search-control">
                  <span>Search: </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input"
                    placeholder="Search..."
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('qno')} className="sortable">
                        Q.NO {getSortIcon('qno')}
                      </th>
                      <th onClick={() => handleSort('subject')} className="sortable">
                        SUBJECT {getSortIcon('subject')}
                      </th>
                      <th onClick={() => handleSort('mainTopic')} className="sortable">
                        MAIN TOPIC {getSortIcon('mainTopic')}
                      </th>
                      <th onClick={() => handleSort('topic')} className="sortable">
                        TOPIC {getSortIcon('topic')}
                      </th>
                      <th onClick={() => handleSort('status')} className="sortable">
                        STATUS {getSortIcon('status')}
                      </th>
                      <th onClick={() => handleSort('timeTaken')} className="sortable">
                        TIME TAKEN(MIN) {getSortIcon('timeTaken')}
                      </th>
                      <th>QUESTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={`${item.qNo}-${index}`}>
                        <td>{item.qNo}</td>
                        <td>{item.subject}</td>
                        <td>{item.mainTopic}</td>
                        <td>{item.topic}</td>
                        <td style={{ color: getStatusColor(item.status) }}>
                          {item.status}
                        </td>
                        <td>{item.timeTaken}</td>
                        <td>
                          <button 
                            className="question-link"
                            onClick={() => handleQuestionClick(item)}
                          >
                            click here
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination-section">
                <div className="pagination-info">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                </div>
                
                <div className="pagination-controls">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {(!packageName || !testName) && (
            <div className="no-selection">
              <p>Please select a package and test to view time taken data.</p>
            </div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && selectedQuestion && (
        <div className="modal-overlay">
          <div className="question-modal">
            <div className="modal-header">
              <h3>Question No# {selectedQuestion.qNo}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowQuestionModal(false)}
              >
                CLOSE
              </button>
            </div>
            
            <div className="modal-content">
              <div className="question-section">
                <h4>QUESTION FOR REFERENCE</h4>
                <div className="question-text">
                  {selectedQuestion.question}
                </div>
              </div>

              <div className="solution-section">
                <h4>SOLUTION</h4>
                <div className="solution-text">
                  {selectedQuestion.solution}
                </div>
              </div>

              <div className="answers-section">
                <div className="answer-column">
                  <h4>KEY ANSWER</h4>
                  <div className="answer-text">
                    {selectedQuestion.keyAnswer}
                  </div>
                </div>

                <div className="answer-column">
                  <h4>YOUR ANSWER</h4>
                  <div className="answer-text">
                    {selectedQuestion.yourAnswer || 'Not Attempted'}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="check-options-btn">CHECK ALL OPTIONS</button>
                <button className="key-btn">KEY</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTakenPage;
