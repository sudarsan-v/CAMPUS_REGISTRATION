import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { getCurrentUser, requireAuth, getUserDisplayName, getUserId } from '../utils/auth';

const TakeOnlineTest = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check authentication and get user data
    if (requireAuth()) {
      const user = getCurrentUser();
      setUserData(user);
      fetchPackages();
    }
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching packages from API...');
      // Call the real API to get packages
      const response = await axios.get(`${API_BASE_URL}/institute/packages`);
      console.log('Packages API response:', response.data);
      
      if (response.data.success) {
        setPackages(response.data.packages || []);
        console.log('Packages loaded:', response.data.packages);
      } else {
        setError(response.data.message || 'Failed to load packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = async (packageId) => {
    console.log('Package selected:', packageId);
    setSelectedPackage(packageId);
    setTests([]); // Clear previous tests
    
    if (!packageId) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching tests for package:', packageId);
      // Call the tests API when a package is selected
      const response = await axios.get(`${API_BASE_URL}/institute/packages/${packageId}/tests`);
      console.log('Tests API response:', response.data);
      
      if (response.data.success) {
        setTests(response.data.tests || []);
        console.log('Tests loaded:', response.data.tests);
      } else {
        setError(response.data.message || 'Failed to load tests');
        setTests([]);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to load tests. Please try again.');
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  // Get selected package information for display
  const getSelectedPackageInfo = () => {
    const selected = packages.find(pkg => pkg.id === parseInt(selectedPackage));
    return selected ? { name: selected.name, testCount: selected.testCount || 0 } : { name: '', testCount: 0 };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#17a2b8'; // Cyan
      case 'ready': return '#28a745'; // Green
      case 'pending': return '#ffc107'; // Yellow
      case 'not-appeared': return '#dc3545'; // Red
      case 'scheduled': return '#007bff'; // Blue
      default: return '#6c757d'; // Gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'ready': return 'Ready';
      case 'pending': return 'Pending';
      case 'not-appeared': return 'Not Appeared';
      case 'scheduled': return 'Scheduled';
      default: return 'Unknown';
    }
  };

  // Single handleTakeTest function with navigate
  const handleTakeTest = (testId, status) => {
    if (status === 'ready') {
      // Navigate to exam info page instead of directly to test
      navigate(`/exam-info/${testId}`);
    } else if (status === 'completed') {
      // Show results or navigate to exam info
      navigate(`/exam-info/${testId}`);
    } else {
      alert(`Test is ${status}. Cannot start now.`);
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
        <span style={{ fontSize: '16px' }}>{getUserDisplayName()}</span>
      </header>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        margin: '20px',
        borderRadius: '8px',
        padding: '30px',
        minHeight: 'calc(100vh - 100px)'
      }}>
        {/* Package Selection */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <label style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            minWidth: '150px'
          }}>
            Select Package
          </label>
          <select
            value={selectedPackage}
            onChange={(e) => handlePackageSelect(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              backgroundColor: 'white',
              minWidth: '250px',
              outline: 'none'
            }}
          >
            <option value="">Select Package</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.testCount || 0} tests)
              </option>
            ))}
          </select>
        </div>

        {/* Status Legend */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#17a2b8'
            }}></div>
            <span>Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#28a745'
            }}></div>
            <span>Ready</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#ffc107'
            }}></div>
            <span>Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#dc3545'
            }}></div>
            <span>Not Appeared</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#007bff'
            }}></div>
            <span>Scheduled</span>
          </div>
        </div>

        {/* Tests Table Header */}
        {selectedPackage && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            <div>Package Name : {getSelectedPackageInfo().name}</div>
            <div>No of Tests : {getSelectedPackageInfo().testCount}</div>
          </div>
        )}

        {/* Tests List */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            Loading packages...
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            fontSize: '18px', 
            color: '#dc3545' 
          }}>
            {error}
          </div>
        )}

        {!loading && !error && selectedPackage && tests.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            fontSize: '18px',
            color: '#666'
          }}>
            No tests found for selected package.
          </div>
        )}

        {!loading && !error && !selectedPackage && (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            fontSize: '18px',
            color: '#666'
          }}>
            Please select a package to view available tests.
          </div>
        )}

        {/* Test Cards */}
        {tests.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {tests.map(test => (
              <div
                key={test.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(test.status)
                  }}></div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: getStatusColor(test.status)
                  }}>
                    {getStatusText(test.status)}
                  </span>
                </div>
                
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '18px',
                  color: '#333'
                }}>
                  {test.name}
                </h3>
                
                <div style={{ marginBottom: '15px', color: '#666' }}>
                  <div>Questions: {test.questions}</div>
                  <div>Duration: {test.duration}</div>
                </div>
                
                <button
                  onClick={() => handleTakeTest(test.id, test.status)}
                  disabled={test.status === 'pending' || test.status === 'scheduled'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: test.status === 'ready' ? 'pointer' : 'not-allowed',
                    backgroundColor: test.status === 'ready' ? '#28a745' : 
                                   test.status === 'completed' ? '#17a2b8' : '#6c757d',
                    color: 'white',
                    opacity: test.status === 'pending' || test.status === 'scheduled' ? 0.6 : 1
                  }}
                >
                  {test.status === 'ready' ? 'Start Test' :
                   test.status === 'completed' ? 'View Results' :
                   test.status === 'pending' ? 'Pending' :
                   test.status === 'scheduled' ? 'Scheduled' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeOnlineTest;