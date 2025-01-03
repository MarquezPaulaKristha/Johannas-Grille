import React, { useState } from 'react';
import './Login.css';
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios';
import { useProvider } from '../../../global_variable/provider';

const LoginPopUp = () => {
  const { customer, setCustomer } = useProvider();
  const [currState, setCurrState] = useState("Sign Up");
  const [isVisible, setIsVisible] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setIsVisible(false);
  };

  // Function to reset the form
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setAddress('');
    setEmail('');
    setPhoneNumber('');
    setUsername('');
    setPassword('');
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        firstname: firstName,
        lastname: lastName,
        address,
        email,
        phonenumber: phoneNumber,
        username,
        password,
      });
  
      setMessage(response.data.message);
      if (response.status === 201) {
        setCurrState("Login");
        resetForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error signing up');
    }
  };
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/customer/login', { username, password });
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setCustomer(response.data);
        window.location.reload();
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className='login-popup'>
      <div className="login-popup-content">
        <div className="login-popup-left">
          <h2>Create Account for Reservation</h2>
          {currState === "Login" ? (
            <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
          )}
        </div>
        <div className="login-popup-right">
          <span className="login-popup-close" onClick={handleClose}><IoIosCloseCircle size={25} /></span>
          <h2>{currState}</h2>

          {message && <div className="login-popup-message">{message}</div>}

          {currState === "Sign Up" && (
            <>
              <div className="customer-right-content">
                <div className="customer-name">
                  <input type="text" placeholder='First Name' required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input type="text" placeholder='Last Name' required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="customer-login-info">
                  <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                  <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="text" placeholder='Address' required value={address} onChange={(e) => setAddress(e.target.value)} />
                <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="tel" placeholder='Phone Number' required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>  
              <button className="login-popup-button" onClick={handleSignUp}>
                Sign Up
              </button>
            </>
          )}

          {currState === "Login" && (
            <>
              <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="login-popup-button" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;
