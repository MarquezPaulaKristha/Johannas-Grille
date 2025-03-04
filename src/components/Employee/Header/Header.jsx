import React, { useEffect } from 'react';
import './Header.css';
import ProfileHeader from './HeaderProfile';
import { HiOutlineBell } from "react-icons/hi2";
import { useProvider } from "../../../global_variable/Provider";

const Header = () => {
  const { branch, setBranch } = useProvider();

  useEffect(() => {
    const userBranch = sessionStorage.getItem("branch") || "N/A"; 
    console.log("Retrieved branch from sessionStorage:", userBranch); 
    setBranch(userBranch);
  }, [setBranch]); 

  return (
    <header className="em-header">
      <div className="em-search-container">
        <div className="em-search-box">
          <p>Employee Side</p>
          <p>Branch: {branch}</p>
        </div>
      </div>
      <div className="em-profile-icon">
        <i><HiOutlineBell size={27} /></i>
        <i><ProfileHeader /></i>
      </div>
    </header>
  );
};

export default Header;