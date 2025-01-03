import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";
import Navbar from '../../../pages/Customer/Navbar/Navbar';
import './CustomerInfo.css';
import axios from 'axios';
import { useProvider } from '../../../global_variable/provider';

const ProfileCustomer = () => {
  const { customer, setCustomer } = useProvider();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          navigate('/login'); // Redirect to login page
          return;
        }

        const response = await axios.get('http://localhost:3000/api/customer/info', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomer(response.data.data); // Access the `data` field from the response
        setError(null); // Clear any previous error
      } catch (error) {
        console.error('Error fetching customer data:', error);
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page
        } else {
          setError(error.response?.data?.message || 'Failed to fetch customer data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="customer-info-header">
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="customer-info-header">
          <h1>Profile</h1>
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="customer-info-header">
        <h1>Profile</h1>
      </div>

      <div className="customer-info-content">
        <div className="customer-info">
          <div className="customer-avatar-box">
            {customer.image_url ? (
              <img src={customer.image_url} alt="Profile" className="customer-avatar-img" />
            ) : (
              <RxAvatar className="customer-avatar" size={100} />
            )}
          </div>
          <h2 className="customer-avatar-name">
            {customer.firstname} {customer.lastname}
          </h2>
        </div>

        <div className="customer-info-form">
          <h3>Account Settings</h3>
          <div className="customer-form-row">
            <div className="customer-form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" value={customer.firstname || ''} readOnly />
            </div>
            <div className="customer-form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" value={customer.lastname || ''} readOnly />
            </div>
          </div>

          <div className="customer-form-row">
            <div className="customer-form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" value={customer.username || ''} readOnly />
            </div>
            <div className="customer-form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={customer.email || ''} readOnly />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileCustomer;
