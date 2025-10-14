import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storeUserData } from '../utils/auth';
import API_BASE_URL from '../config/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [message, setMessage] = useState('');

  // Fetch CAPTCHA from backend
  const fetchCaptcha = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/captcha`);
      setCaptchaValue(res.data.captcha);
    } catch (error) {
      setCaptchaValue('ERROR');
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/api/login`, { username, password, captcha })
      .then(response => {
        setMessage(response.data.message);
        if (response.data.success) {
          // Store user data in sessionStorage
          storeUserData(response.data.user);
          const role = response.data.role;
          if (role === 1) {
            window.location.href = '/campus'; // For meslova_1 (role 1)
          } else if (role === 2) {
            window.location.href = '/dashboard'; // For mes_user1 (role 2)
          } else {
            setMessage('Unknown role. Please contact support.');
          }
        } else {
          fetchCaptcha(); // Refresh CAPTCHA on failure
        }
      })
      .catch(error => {
        setMessage('Login failed. Please try again.');
        fetchCaptcha(); // Refresh CAPTCHA on error
      });
  };

  return (
    <div style={{ backgroundColor: '#00A8CC', height: '100vh', display: 'flex', alignItems: 'center', padding: '20px' }}>
      {/* Left side - Logo */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <img 
          src="/citine-logo.svg" 
          alt="Citine Logo" 
          style={{ 
            width: '200px', 
            height: 'auto',
            maxWidth: '80%'
          }} 
        />
      </div>
      
      {/* Right side - Login form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', textAlign: 'center', width: '300px' }}>
          <h2>LOGIN</h2>
          <p>Welcome to Citrine Online Examinations</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
              <span style={{ color: '#000', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '2px' }}>{captchaValue}</span>
              <button
                type="button"
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={fetchCaptcha}
                title="Refresh CAPTCHA"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Enter CAPTCHA"
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <button
              type="submit"
              style={{ backgroundColor: '#6B48FF', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              LOGIN
            </button>
            {message && <p style={{ color: message.toLowerCase().includes('fail') || message.toLowerCase().includes('invalid') ? 'red' : 'green' }}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;