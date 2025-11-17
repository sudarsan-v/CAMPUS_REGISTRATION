import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faFileAlt, faChartPie, faBell, faUser, faBars, faClipboardList, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import { getCurrentUser, requireAuth, getUserDisplayName, getUserId, logout } from '../utils/auth';
import API_BASE_URL from '../config/api';
import './StudentDashboard.css';
const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    // Check authentication and get user data
    if (requireAuth()) {
      const user = getCurrentUser();
      setUserData(user);
      
      // Fetch profile data
      if (user && user.user_id) {
        fetchProfileData(user.user_id);
      }
    }
  }, []);

  const fetchProfileData = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/institute/student/home/getprofile?student_id=${userId}`);
      if (response.data.success) {
        setProfileData(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

const handleLogout = () => {
    axios.post(`${API_BASE_URL}/api/logout`)
      .then(response => {
        logout(); // Clear session and redirect
      })
      .catch(error => {
        console.error('Logout error:', error);
        // Even if API call fails, clear session and redirect
        logout();
      });
  };

  const sidebarItems = [
    { icon: faTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: faFileAlt, label: 'Take Online Test', path: '/take-test' },
    { icon: faClipboardList, label: 'Reports', path: '/reports' },
    { icon: faChartPie, label: 'Progress Report', path: '/progress-report' },
    { icon: faBell, label: 'Notifications', path: '/notifications' }
  ];
  return (
    <div className="container-fluid vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center bg-info text-white p-3 position-relative" style={{ zIndex: 1000 }}>
        <div className="d-flex align-items-center">
          <div 
            className="mr-2" 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </div>
          <h2 className="m-0">Citrine Online Exams</h2>
        </div>
        <div
          className="position-relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <span className="cursor-pointer">{getUserDisplayName()}</span>
          {isDropdownOpen && (
            <div
              className="position-absolute bg-white border rounded shadow p-2"
              style={{ right: 0, top: '100%', zIndex: 1000 }}
            >
              <Link className="dropdown-item text-dark d-block p-2" to="/profile" onClick={() => setIsDropdownOpen(false)}>
                Profile
              </Link>
              <Link className="dropdown-item text-dark d-block p-2" to="/change-password" onClick={() => setIsDropdownOpen(false)}>
                Password Change
              </Link>
              <Link className="dropdown-item text-dark d-block p-2" to="/logout" onClick={handleLogout}>
                <span
                         // style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                          
                        >
                          <FiLogOut /> Logout
                        </span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="row">
        {/* Sidebar */}
        <nav 
          className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            width: isSidebarExpanded ? '250px' : '60px',
            backgroundColor: '#2c3e50',
            transition: 'width 0.3s ease',
            zIndex: 999,
            paddingTop: '80px',
            overflowX: 'hidden'
          }}
        >
          <div className="sidebar-content">
            {sidebarItems.map((item, index) => (
              <div 
                key={index}
                className="nav-item-wrapper"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ position: 'relative' }}
              >
                <Link 
                  className="nav-link d-flex align-items-center" 
                  to={item.path}
                  style={{
                    color: '#ecf0f1',
                    padding: '15px 20px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '0px',
                    margin: '2px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#34495e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    style={{ 
                      fontSize: '18px',
                      minWidth: '20px',
                      textAlign: 'center'
                    }} 
                  />
                  {isSidebarExpanded && (
                    <span style={{ 
                      marginLeft: '15px',
                      whiteSpace: 'nowrap',
                      opacity: isSidebarExpanded ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}>
                      {item.label}
                    </span>
                  )}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {!isSidebarExpanded && hoveredItem === item.label && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '65px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      zIndex: 1001,
                      border: '1px solid #34495e'
                    }}
                  >
                    {item.label}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderRight: '6px solid #2c3e50'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main 
          className="px-4" 
          style={{ 
            marginLeft: isSidebarExpanded ? '250px' : '60px', 
            transition: 'margin-left 0.3s ease',
            minHeight: '100vh',
            paddingTop: '20px'
          }}
        >
          {/* Profile Details */}
          <div className="mt-4">
            <h5>Profile Details</h5>
            <div className="card bg-success text-white profile-card" style={{ maxWidth: '300px' }}>
              <div className="card-body">
                <div className="text-center mb-3">
                  <FontAwesomeIcon icon={faUser} size="3x" />
                </div>
                <p>Name: {profileData ? `${profileData.student_firstname || ''} ${profileData.student_lastname || ''}` : (userData?.name || 'Loading...')}</p>
                <p>User Name: {userData?.username || 'Loading...'}</p>
                <p>Mobile No: {profileData?.mobile_number || 'Not provided'}</p>
                <p>Class: XII</p>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="mt-5">
            <h5>Dashboard</h5>
            <div className="row">
              <div className="col-md-3 mb-3">
                <Link to="/take-test" style={{ textDecoration: 'none' }}>
                  <div className="card bg-success text-white text-center dashboard-card">
                    <div className="card-body">
                      <FontAwesomeIcon icon={faFileAlt} size="2x" />
                      <h5 className="card-title mt-2">Take Online Test</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                  <div className="card bg-danger text-white text-center dashboard-card">
                    <div className="card-body">
                      <FontAwesomeIcon icon={faFileAlt} size="2x" />
                      <h5 className="card-title mt-2">Reports</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <Link to="/progress-report" style={{ textDecoration: 'none' }}>
                  <div className="card bg-warning text-white text-center dashboard-card">
                    <div className="card-body">
                      <FontAwesomeIcon icon={faChartPie} size="2x" />
                      <h5 className="card-title mt-2">Progress Report</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <Link to="/notifications" style={{ textDecoration: 'none' }}>
                  <div className="card bg-orange text-white text-center dashboard-card" style={{ backgroundColor: '#fd7e14' }}>
                    <div className="card-body">
                      <FontAwesomeIcon icon={faBell} size="2x" />
                      <h5 className="card-title mt-2">Notifications</h5>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 bg-light border-top">
        <p className="text-muted">All rights reserved - CitrineSchools Copyright © 2023.</p>
      </footer>
    </div>
  );
};

export default StudentDashboard;