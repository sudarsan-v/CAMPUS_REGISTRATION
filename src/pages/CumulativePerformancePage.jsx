import React, { useState } from 'react';
import './CumulativePerformancePage.css';

const CumulativePerformancePage = () => {
  const [selectedPackage, setSelectedPackage] = useState('SamplePackage');
  const [selectedTests, setSelectedTests] = useState(['TEST-2']); // Default to TEST-2 as shown in screenshots
  const [showResults, setShowResults] = useState(false);
  const [generatedData, setGeneratedData] = useState([]);

  // Mock data for different test scenarios
  const getMockData = (testIds) => {
    const allTestData = {
      'TEST-1': {
        testDate: '06-06-2025',
        testName: 'TEST-1',
        maths: '1/5.0',
        physics: '1/5.0',
        chemistry: '0/5.0',
        total: '2/15',
        percentage: '13.33'
      },
      'TEST-2': {
        testDate: '25-06-2025',
        testName: 'TEST-2',
        maths: '1/5.0',
        physics: '2/3.0',
        chemistry: '0/2.0',
        total: '3/10',
        percentage: '30.00'
      },
      'TEST-3': {
        testDate: '15-07-2025',
        testName: 'TEST-3',
        maths: '3/5.0',
        physics: '2/5.0',
        chemistry: '1/5.0',
        total: '6/15',
        percentage: '40.00'
      }
    };

    return testIds.map(testId => allTestData[testId]).filter(Boolean);
  };

  const calculateEstimatedAverage = (data) => {
    if (data.length === 0) return null;
    
    let totalMaths = 0, totalPhysics = 0, totalChemistry = 0;
    let totalMarks = 0, totalPossible = 0;
    
    data.forEach(item => {
      const [mathsObtained, mathsTotal] = item.maths.split('/').map(Number);
      const [physicsObtained, physicsTotal] = item.physics.split('/').map(Number);
      const [chemistryObtained, chemistryTotal] = item.chemistry.split('/').map(Number);
      
      totalMaths += mathsObtained;
      totalPhysics += physicsObtained;
      totalChemistry += chemistryObtained;
      
      const [obtained, possible] = item.total.split('/').map(Number);
      totalMarks += obtained;
      totalPossible += possible;
    });
    
    const avgMaths = (totalMaths / data.length).toFixed(1);
    const avgPhysics = (totalPhysics / data.length).toFixed(1);
    const avgChemistry = (totalChemistry / data.length).toFixed(1);
    const avgTotal = `${(totalMarks / data.length).toFixed(1)}/${(totalPossible / data.length).toFixed(1)}`;
    const avgPercentage = ((totalMarks / totalPossible) * 100).toFixed(2);
    
    return {
      maths: avgMaths,
      physics: avgPhysics,
      chemistry: avgChemistry,
      total: avgTotal,
      percentage: avgPercentage
    };
  };

  // Static data
  const packages = [
    { value: 'SamplePackage', label: 'SamplePackage' },
    { value: 'AdvancedPackage', label: 'AdvancedPackage' },
    { value: 'BasicPackage', label: 'BasicPackage' }
  ];

  const tests = [
    { id: 'TEST-1', name: 'TEST-1' },
    { id: 'TEST-2', name: 'TEST-2' },
    { id: 'TEST-3', name: 'TEST-3' }
  ];

  const handleTestSelection = (testId) => {
    setSelectedTests(prev => {
      if (prev.includes(testId)) {
        return prev.filter(id => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  const handleGenerate = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }
    
    const mockData = getMockData(selectedTests);
    setGeneratedData(mockData);
    setShowResults(true);
    console.log('Generating report for:', { selectedPackage, selectedTests });
  };

  const handleClearResults = () => {
    setShowResults(false);
    setGeneratedData([]);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="cumulative-performance-page">
      {/* Header */}
      <header className="performance-header">
        <h1 className="app-title">Meslova</h1>
        <span className="user-name">Mesuser</span>
      </header>

      {/* Main Content */}
      <div className="performance-content">
        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">Cumulative Performance</h2>
          <button className="go-back-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        {/* Selection Form */}
        <div className="selection-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="package-select">Package :</label>
              <select
                id="package-select"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="package-select"
              >
                {packages.map(pkg => (
                  <option key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="test-select">Test Name :</label>
              <div className="test-selection">
                <select className="test-select-header">
                  <option>--Select--</option>
                </select>
                <div className="test-checkboxes">
                  {tests.map(test => (
                    <label key={test.id} className="test-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => handleTestSelection(test.id)}
                      />
                      {test.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="generate-section">
            <button className="generate-btn" onClick={handleGenerate}>
              GENERATE
            </button>
            {showResults && (
              <button className="clear-btn" onClick={handleClearResults}>
                CLEAR RESULTS
              </button>
            )}
          </div>
        </div>

        {/* Results Table - Only show after generate is clicked */}
        {showResults && (
          <div className="results-section">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>TEST DATE</th>
                  <th>TEST NAME</th>
                  <th>MATHS</th>
                  <th>PHYSICS</th>
                  <th>CHEMISTRY</th>
                  <th>TOTAL</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {generatedData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.testDate}</td>
                    <td>{row.testName}</td>
                    <td>{row.maths}</td>
                    <td>{row.physics}</td>
                    <td>{row.chemistry}</td>
                    <td>{row.total}</td>
                    <td>{row.percentage}</td>
                  </tr>
                ))}
                {generatedData.length > 0 && (
                  <tr className="estimated-avg-row">
                    <td></td>
                    <td><strong>Estd.Avg.</strong></td>
                    <td>{calculateEstimatedAverage(generatedData)?.maths || '0.0'}</td>
                    <td>{calculateEstimatedAverage(generatedData)?.physics || '0.0'}</td>
                    <td>{calculateEstimatedAverage(generatedData)?.chemistry || '0.0'}</td>
                    <td>{calculateEstimatedAverage(generatedData)?.total || '0.0/0.0'}</td>
                    <td>{calculateEstimatedAverage(generatedData)?.percentage || '0.00'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CumulativePerformancePage;
