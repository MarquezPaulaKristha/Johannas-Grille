import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Admin_LoginPopUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://johannas-grille.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response:', response);

      // Handle non-JSON responses or errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}: ${errorText}`);
        alert(`Login failed: ${errorText}`);
        return;
      }

      // Ensure response is JSON
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

          if (data.usertype === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        } else {
          alert(data.message);
        }
      } else {
        const errorMessage = await response.text();
        console.error('Non-JSON response:', errorMessage);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className='admin-login-popup'>
      <div className="admin-login-popup-content">
        <div className="admin-login-popup-left">
          <img src="/src/assets/logo.png" alt="Logo" className="admin-login-logo" />
        </div>
        <div className="admin-login-popup-right">
          <h2>Login</h2>
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
          <button className="admin-login-popup-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin_LoginPopUp;
