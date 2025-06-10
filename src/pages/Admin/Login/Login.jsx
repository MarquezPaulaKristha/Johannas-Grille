import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Admin_LoginPopUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setErrorMessage('');
    try {
      const response = await fetch('https://johannas-grille.onrender.com/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        setErrorMessage(data?.message || 'Login failed. Please try again.');
        return;
      }

      if (data && data.success) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('firstname', data.firstname);
        sessionStorage.setItem('lastname', data.lastname);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('usertype', data.usertype);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('image', data.image);
        sessionStorage.setItem('branch', data.branch);

        if (data.usertype === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setErrorMessage(data?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='admin-login-popup'>
      <div className="admin-login-popup-content">
        <div className="admin-login-popup-left">
          <img src="/logo.png" alt="Logo" className="admin-login-logo" />
        </div>
        <div className="admin-login-popup-right">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="admin-login-popup-button">
              Login
            </button>
          </form>
          {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin_LoginPopUp;
