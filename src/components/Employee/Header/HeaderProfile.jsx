import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderProfile.css'; // Import the CSS
import { FaUser } from 'react-icons/fa'; // Import an icon from react-icons (or any other icon library)

function ProfileHeader({ text }) {
  const [image, setImage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggles the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Handle clicks outside of the dropdown to close it
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown') && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle logout by clearing the session storage
  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage on logout
    navigate('/admin/login'); // Redirect to login page
  };

  useEffect(() => {
    const storedImage = sessionStorage.getItem('image');
    console.log('Image URL:', storedImage); // Log the image URL for debugging

    // Prepend base URL if necessary
    const baseURL = 'http://localhost:3000';
    setImage(storedImage ? `${baseURL}${storedImage}` : '');
    const username = sessionStorage.getItem('username');
    const usertype = sessionStorage.getItem('usertype');

    // If no user is logged in, redirect to login page
    if (!username || !usertype) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <header className="emp-profile-header">
      <h1>{text}</h1>
      <div className="emp-profile-container">
        <div className="emp-profile-info">
          <div className="emp-name">
            {`${sessionStorage.getItem('firstname') || 'Employee'} ${sessionStorage.getItem('lastname') || ''}`}
          </div>
          <div className="emp-role">{sessionStorage.getItem('usertype') || 'Employee'}</div>
        </div>
        <div className="emp-dropdown">
          <i className="emp-profile-image" onClick={toggleDropdown} aria-expanded={isDropdownOpen}>
            {image ? (
              <img src={image} alt="Profile" className="employee-img" />
            ) : (
              <FaUser Circle className="placeholder-icon" /> // Display the icon if image is null
            )}
          </i>
          {isDropdownOpen && (
            <div className="emp-dropdown-content">
              <ul>
                <li>Account Settings</li>
                <li className="emp-logout" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;