import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('token'); // or any other session data you want to check

  // If no user is authenticated, redirect to login page
  if (!username || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;