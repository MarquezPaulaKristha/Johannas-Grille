import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../../assets/assets';
import { Link } from 'react-router-dom';
import Cart from '../../../pages/Customer/Cart/Cart';
import Login from '../../../pages/Customer/Login/Login';
import CustomerProfile from '../CustomerProfile/CustomerProfile/CustomerProfile'; // Import CustomerProfile
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Import menu icons

const Navbar = ({ orderId }) => {
  useEffect(() => {
    console.log("Order ID passed to Navbar:", orderId); // Log the orderId received in Navbar
  }, [orderId]);

  const [menu, setMenu] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // State to toggle CustomerProfile
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle

  const handleCartClick = () => {
    setShowAddToCart(prevState => !prevState);
  };

  const handleLoginClick = () => {
    setShowLogin(prevState => !prevState);
  };

  const handleProfileClick = () => {
    setShowProfile(prevState => !prevState);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  // Check if user is logged in based on the presence of a token
  const isLoggedIn = !!localStorage.getItem('token'); // Replace 'token' with your actual token key

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className="logo" />

      {/* Menu Toggle Button */}
      <div className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <AiOutlineClose size={26} /> : <AiOutlineMenu size={26} />}
      </div>

      <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        <Link to='/' onClick={() => { setMenu("home"); setIsMenuOpen(false); }} className={menu === "home" ? "active" : ""}>HOME</Link>
        <a href='#explore-menu' onClick={() => { setMenu("menu"); setIsMenuOpen(false); }} className={menu === "menu" ? "active" : ""}>MENU</a>
        <a href='#reservation' onClick={() => { setMenu("reservation"); setIsMenuOpen(false); }} className={menu === "reservation" ? "active" : ""}>RESERVATION</a>
        <a href='#footer' onClick={() => { setMenu("contact us"); setIsMenuOpen(false); }} className={menu === "contact us" ? "active" : ""}>CONTACT US</a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-icon">
          <i onClick={handleCartClick} className='nav'>{<FiShoppingCart size={26} />}</i>
          {showAddToCart && <Cart orderId={orderId} />}
          <div className="dot"></div>
        </div>

        {!isLoggedIn && (
          <button onClick={handleLoginClick} className='login-btn'>Sign In</button>
        )}
        {showLogin && <Login />}

        <div className="profile-section">
          {isLoggedIn && (
            <>
              <MdOutlineAccountCircle onClick={handleProfileClick} className='profile-icon' size={31} />
              {showProfile && <CustomerProfile />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
