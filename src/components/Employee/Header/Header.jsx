import React, { useEffect, useState } from 'react';
import './Header.css';
import ProfileHeader from './HeaderProfile';
import { IoIosSearch } from "react-icons/io";
import { HiOutlineBell } from "react-icons/hi2";

const Header = () => {
  const [branch, setBranch] = useState('');

  useEffect(() => {
    const userBranch = sessionStorage.getItem('branch'); // Get branch from sessionStorage
    setBranch(userBranch || 'N/A'); // Set branch, default to 'N/A' if not found
  }, []);

  return (
    <header className="em-header">
      <div className="em-search-container">
        <div className="em-search-box">
          <p>Employee Side</p>
          <p>Branch: {branch}</p> {/* Display the branch here */}
        </div>
      </div>
      <div className="em-profile-icon">
        <i><HiOutlineBell size={27} /></i>
        <i><ProfileHeader /></i>
      </div>
    </header>
  );
}

export default Header;
