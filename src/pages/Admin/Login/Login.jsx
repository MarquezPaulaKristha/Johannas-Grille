import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Admin_LoginPopUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://johannasgrille.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}: ${errorText}`);
        alert(`Login failed: ${errorText}`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('firstname', data.firstname);
          sessionStorage.setItem('lastname', data.lastname);
          sessionStorage.setItem('email', data.email);
          sessionStorage.setItem('usertype', data.usertype);
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('image', data.image);
          sessionStorage.setItem('branch', data.branch);

          navigate(data.usertype === 'Admin' ? '/admin/dashboard' : '/employee/dashboard');
        } else {
          alert(data.message);
        }
      } else {
        const nonJsonResponse = await response.text();
        console.error('Non-JSON response:', nonJsonResponse);
        alert('Unexpected response. Please contact support.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-popup">
      <div className="admin-login-popup-content">
        <div className="admin-login-popup-left">
          <img src="/assets/logo.png" alt="Logo" className="admin-login-logo" />
        </div>
        <div className="admin-login-popup-right">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            className="admin-login-popup-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin_LoginPopUp;
