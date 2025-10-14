import React from 'react';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios.post('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/logout')
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