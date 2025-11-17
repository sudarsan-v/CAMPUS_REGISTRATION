import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { requireAuth, getUsername, logout, navigateToDashboard } from '../utils/auth';
import { API_ENDPOINTS } from '../config/api-detailed';

const ChangePasswordPage = () => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and get username
    if (requireAuth()) {
      const username = getUsername();
      if (username) {
        setUsername(username);
      }
    }
  }, []);

  const handleLogoClick = () => {
    navigateToDashboard(navigate);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
    try {
      const response = await axios.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        username,
        oldPassword,
        newPassword,
        confirmPassword
      });
      if (response.data.success) {
        setMessage('Password changed successfully!');
        setTimeout(() => {
          navigateToDashboard(navigate);
        }, 2000);
      } else {
        setMessage(response.data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setMessage('Failed to change password.');
    }
  };

  return (
    <div style={{ background: '#5ec4e3', minHeight: '100vh', padding: '0' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '12px 24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <img 
            src="/citine-logo.svg" 
            alt="MESLOVA Logo" 
            style={{ height: '40px', marginRight: '12px' }}
          />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#333',
            fontFamily: 'Arial, sans-serif'
          }}>
            MESLOVA
          </span>
        </div>
        
        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#666',
            fontSize: '0.95rem'
          }}>
            <FaUser style={{ fontSize: '16px' }} />
            <span>{username}</span>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#666',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f5f5f5';
              e.target.style.borderColor = '#ccc';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#ddd';
            }}
          >
            <FiLogOut style={{ fontSize: '14px' }} />
            Logout
          </button>
        </div>
      </div>
      <div style={{
        maxWidth: '400px',
        margin: '60px auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          padding: '18px 0 8px 24px',
          borderBottom: '1px solid #e0e0e0',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.3rem'
        }}>
          Change Password
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '18px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            disabled
            required
          />
          <input
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '18px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '18px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            required
          />
          <input
            type="password"
            placeholder="Enter new confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '24px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            required
          />
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                background: '#4caf50',
                color: 'white',
                padding: '10px 32px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </div>
          {message && (
            <div style={{ marginTop: '18px', color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;