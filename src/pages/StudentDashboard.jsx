import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faFileAlt, faChartPie, faBell, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import { getCurrentUser, requireAuth, getUserDisplayName, getUserId, logout } from '../utils/auth';
import API_BASE_URL from '../config/api';
const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);

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
  return (
    <div className="container-fluid vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center bg-info text-white p-3 position-relative">
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        <nav className={`col-md-2 d-${isMenuOpen ? 'block' : 'none'} d-md-block bg-white sidebar border-right vh-100 position-fixed`}
             style={{ left: isMenuOpen ? '0' : '-250px', transition: 'left 0.3s' }}>
          <div className="sidebar-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link active text-primary" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-muted" to="/take-test" onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Take Online Test
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-muted" to="/reports" onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-muted" to="/progress-report" onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                  Progress Report
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-muted" to="/notifications" onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 ml-md-2 px-4" style={{ marginLeft: isMenuOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          {/* Profile Details */}
          <div className="mt-4">
            <h5>Profile Details</h5>
            <div className="card bg-success text-white" style={{ maxWidth: '300px' }}>
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
                  <div className="card bg-success text-white text-center">
                    <div className="card-body">
                      <FontAwesomeIcon icon={faFileAlt} size="2x" />
                      <h5 className="card-title mt-2">Take Online Test</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                  <div className="card bg-danger text-white text-center">
                    <div className="card-body">
                      <FontAwesomeIcon icon={faFileAlt} size="2x" />
                      <h5 className="card-title mt-2">Reports</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-white text-center">
                  <div className="card-body">
                    <FontAwesomeIcon icon={faChartPie} size="2x" />
                    <h5 className="card-title mt-2">Progress Report</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-orange text-white text-center" style={{ backgroundColor: '#fd7e14' }}>
                  <div className="card-body">
                    <FontAwesomeIcon icon={faBell} size="2x" />
                    <h5 className="card-title mt-2">Notifications</h5>
                  </div>
                </div>
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