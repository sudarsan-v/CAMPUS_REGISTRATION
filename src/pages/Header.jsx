import React from 'react';
import { FaUser, FaBell } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api-detailed.js';

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios.post(API_ENDPOINTS.LOGOUT)
      .then(response => {
        if (response.data.success) {
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  const handleLogoClick = () => {
    navigate('/campus');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <div style={{
      backgroundColor: '#57c3e8',
      padding: '18px 32px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }}>
      <span 
        style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.05em', cursor: 'pointer' }} 
        onClick={handleLogoClick}
      >
        MESLOVA
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span 
          style={{ 
            fontSize: '1.2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)'
            }
          }}
          onClick={handleNotificationsClick}
          title="View Notifications"
        >
          <FaBell /> Notifications
        </span>
        <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUser /> Welcome MeslovaUser
          <Link to="/change-password" style={{ color: 'white', marginLeft: '16px', textDecoration: 'underline' }}>
            Change Password
          </Link>
        </span>
        <span
          style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </span>
      </div>
    </div>
  );
}

export default Header;