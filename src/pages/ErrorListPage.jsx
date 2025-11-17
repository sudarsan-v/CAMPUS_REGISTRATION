import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorListPage.css';

const ErrorListPage = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  // Static data
  const packages = [
    { value: '', label: 'Select package' },
    { value: 'SamplePackage', label: 'SamplePackage' },
    { value: 'AdvancedPackage', label: 'AdvancedPackage' },
    { value: 'BasicPackage', label: 'BasicPackage' }
  ];

  const tests = {
    'SamplePackage': [
      { value: '', label: 'Select Test' },
      { value: 'TEST-1', label: 'TEST-1' },
      { value: 'TEST-2', label: 'TEST-2' }
    ],
    'AdvancedPackage': [
      { value: '', label: 'Select Test' },
      { value: 'ADV-TEST-1', label: 'ADV-TEST-1' },
      { value: 'ADV-TEST-2', label: 'ADV-TEST-2' }
    ],
    'BasicPackage': [
      { value: '', label: 'Select Test' },
      { value: 'BASIC-TEST-1', label: 'BASIC-TEST-1' }
    ]
  };

  const subjects = ['MATHS', 'PHYSICS', 'CHEMISTRY', 'All'];

  // Mock error data
  const errorData = [
    { qno: 2, subject: 'MATHS', topic: 'JEEMAIN-XII MATHS', key: 'c', answer: 'b', status: 'Incorrect', time: '0.18', solution: 'click here' },
    { qno: 3, subject: 'MATHS', topic: 'JEEMAIN-XII MATHS', key: 'c', answer: 'a', status: 'Incorrect', time: '0.37', solution: 'click here' },
    { qno: 4, subject: 'MATHS', topic: 'JEEMAIN-XII MATHS', key: 'c', answer: 'd', status: 'Incorrect', time: '0.15', solution: 'click here' },
    { qno: 5, subject: 'MATHS', topic: 'JEEMAIN-XII MATHS', key: 'c', answer: 'd', status: 'Incorrect', time: '1.12', solution: 'click here' },
    { qno: 7, subject: 'PHYSICS', topic: 'JEEMAIN-XII PHYSICS', key: 'd', answer: 'a', status: 'Incorrect', time: '0.07', solution: 'click here' },
    { qno: 8, subject: 'PHYSICS', topic: 'JEEMAIN-XII PHYSICS', key: 'd', answer: 'b', status: 'Incorrect', time: '0.07', solution: 'click here' },
    { qno: 9, subject: 'PHYSICS', topic: 'JEEMAIN-XII PHYSICS', key: 'b', answer: '--', status: 'Unattempted', time: '8.62', solution: 'click here' },
    { qno: 10, subject: 'PHYSICS', topic: 'JEEMAIN-XII PHYSICS', key: 'b', answer: 'd', status: 'Incorrect', time: '0.12', solution: 'click here' },
    { qno: 11, subject: 'CHEMISTRY', topic: 'JEEMAIN-XII CHEMISTRY', key: 'c', answer: 'b', status: 'Incorrect', time: '0.25', solution: 'click here' },
    { qno: 12, subject: 'CHEMISTRY', topic: 'JEEMAIN-XII CHEMISTRY', key: 'c', answer: 'd', status: 'Incorrect', time: '0.12', solution: 'click here' },
    { qno: 13, subject: 'CHEMISTRY', topic: 'JEEMAIN-XII CHEMISTRY', key: 'a', answer: 'b', status: 'Incorrect', time: '2.45', solution: 'click here' },
    { qno: 14, subject: 'CHEMISTRY', topic: 'JEEMAIN-XII CHEMISTRY', key: 'b', answer: '--', status: 'Unattempted', time: '0.00', solution: 'click here' },
    { qno: 15, subject: 'MATHS', topic: 'JEEMAIN-XII MATHS', key: 'a', answer: 'c', status: 'Incorrect', time: '3.21', solution: 'click here' }
  ];

  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value);
    setSelectedTest('');
    setSelectedSubject('All');
    setShowTable(false);
  };

  const handleTestChange = (e) => {
    setSelectedTest(e.target.value);
    setSelectedSubject('All');
    setShowTable(false);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    if (selectedPackage && selectedTest) {
      setShowTable(true);
      setCurrentPage(1);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Filter and sort data
  const getFilteredData = () => {
    let filtered = errorData;

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(item => item.subject === selectedSubject);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric sorting for qno and time
        if (sortConfig.key === 'qno' || sortConfig.key === 'time') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Export functions
  const handleExcelExport = () => {
    const csvContent = [
      ['Q.NO', 'SUBJECT', 'TOPIC', 'KEY', 'ANSWER', 'STATUS', 'TIME', 'SOLUTION'],
      ...filteredData.map(item => [
        item.qno, item.subject, item.topic, item.key, item.answer, item.status, item.time, item.solution
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error_list_${selectedTest}_${selectedSubject}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePDFExport = () => {
    // Create a simple text-based PDF content
    const pdfContent = [
      'Error List Report',
      `Test: ${selectedTest}`,
      `Subject: ${selectedSubject}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'Q.NO\tSUBJECT\tTOPIC\tKEY\tANSWER\tSTATUS\tTIME\tSOLUTION',
      ...filteredData.map(item => 
        `${item.qno}\t${item.subject}\t${item.topic}\t${item.key}\t${item.answer}\t${item.status}\t${item.time}\t${item.solution}`
      )
    ].join('\n');

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error_list_${selectedTest}_${selectedSubject}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error List - ${selectedTest}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #7bb3d3; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .print-date { text-align: right; font-size: 12px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-date">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <div class="header">
            <h1>Error List</h1>
          </div>
          <div class="info">
            <p><strong>Student Name:</strong> Mesuser</p>
            <p><strong>Package:</strong> ${selectedPackage}</p>
            <p><strong>Test Name:</strong> ${selectedTest}</p>
            <p><strong>Subject:</strong> ${selectedSubject}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Q.NO</th>
                <th>SUBJECT</th>
                <th>TOPIC</th>
                <th>KEY</th>
                <th>ANSWER</th>
                <th>STATUS</th>
                <th>TIME</th>
                <th>SOLUTION</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(item => `
                <tr>
                  <td>${item.qno}</td>
                  <td>${item.subject}</td>
                  <td>${item.topic}</td>
                  <td>${item.key}</td>
                  <td>${item.answer}</td>
                  <td>${item.status}</td>
                  <td>${item.time}</td>
                  <td>${item.solution}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="error-list-page">
      {/* Header */}
      <header className="error-header">
        <h1 className="app-title">Meslova</h1>
        <span className="user-name">Mesuser</span>
      </header>

      {/* Main Content */}
      <div className="error-content">
        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">Error List</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        {/* Selection Form */}
        <div className="selection-form">
          <div className="form-row">
            <div className="form-group">
              <label>Student Name</label>
              <span className="student-name">Mesuser</span>
            </div>

            <div className="form-group">
              <label>Package</label>
              <select
                value={selectedPackage}
                onChange={handlePackageChange}
                className="form-select"
              >
                {packages.map(pkg => (
                  <option key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Test Name</label>
              <select
                value={selectedTest}
                onChange={handleTestChange}
                className="form-select"
                disabled={!selectedPackage}
              >
                {selectedPackage && tests[selectedPackage] ? 
                  tests[selectedPackage].map(test => (
                    <option key={test.value} value={test.value}>
                      {test.label}
                    </option>
                  )) : 
                  <option value="">Select Test</option>
                }
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <div className="subject-radio-group">
                {subjects.map(subject => (
                  <label key={subject} className="radio-label">
                    <input
                      type="radio"
                      name="subject"
                      value={subject}
                      checked={selectedSubject === subject}
                      onChange={() => handleSubjectChange(subject)}
                      disabled={!selectedTest}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Search */}
        {showTable && (
          <div className="table-controls">
            <div className="action-buttons">
              <button className="action-btn excel-btn" onClick={handleExcelExport}>
                Excel
              </button>
              <button className="action-btn print-btn" onClick={handlePrint}>
                Print
              </button>
              <button className="action-btn pdf-btn" onClick={handlePDFExport}>
                PDF
              </button>
            </div>

            <div className="search-container">
              <label>Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="Search in table..."
              />
            </div>
          </div>
        )}

        {/* Results Table */}
        {showTable && (
          <div className="table-section">
            <table className="error-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('qno')} className="sortable">
                    Q.NO {getSortIcon('qno')}
                  </th>
                  <th onClick={() => handleSort('subject')} className="sortable">
                    SUBJECT {getSortIcon('subject')}
                  </th>
                  <th onClick={() => handleSort('topic')} className="sortable">
                    TOPIC {getSortIcon('topic')}
                  </th>
                  <th onClick={() => handleSort('key')} className="sortable">
                    KEY {getSortIcon('key')}
                  </th>
                  <th onClick={() => handleSort('answer')} className="sortable">
                    ANSWER {getSortIcon('answer')}
                  </th>
                  <th onClick={() => handleSort('status')} className="sortable">
                    STATUS {getSortIcon('status')}
                  </th>
                  <th onClick={() => handleSort('time')} className="sortable">
                    TIME {getSortIcon('time')}
                  </th>
                  <th>SOLUTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.qno}</td>
                    <td>{item.subject}</td>
                    <td>{item.topic}</td>
                    <td>{item.key}</td>
                    <td>{item.answer}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.time}</td>
                    <td>
                      <button 
                        className="solution-btn"
                        onClick={() => navigate(`/reasons-wrong-attempt/${item.qno}`)}
                      >
                        {item.solution}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-section">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries 
                {searchTerm && ` (filtered from ${errorData.length} total entries)`}
              </div>
              
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <span className="pagination-current">
                  {currentPage}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorListPage;
