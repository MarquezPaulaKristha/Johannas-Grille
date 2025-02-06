import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderProfile.css';
import { FaUser } from 'react-icons/fa'; 

function ProfileHeader({ text }) {
  const [image, setImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest('.emp-dropdown') && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    setTimeout(() => {
      navigate('/admin/login'); // Ensure redirect works properly
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    const storedImage = sessionStorage.getItem('image');
    console.log('Retrieved Image from session:', storedImage); // Debugging

    if (storedImage && storedImage !== 'null' && storedImage !== 'undefined') {
      const baseURL = 'https://johannas-grille.onrender.com';
      setImage(`${baseURL}${storedImage}`);
    } else {
      setImage(null); // Explicitly set null if no image exists
    }

    const username = sessionStorage.getItem('username');
    const usertype = sessionStorage.getItem('usertype');

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
          <div className="emp-profile-image" onClick={toggleDropdown} aria-expanded={isDropdownOpen}>
            {image ? (
              <img src={image} alt="Profile" className="employee-img" onError={() => setImage(null)} />
            ) : (
              <FaUser className="placeholder-icon" size={30} /> 
            )}
          </div>
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
