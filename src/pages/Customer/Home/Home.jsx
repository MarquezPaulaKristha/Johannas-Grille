import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Home.css';
import Header from '../../../components/Customer/Header/Header';
import Product from '../Product/Product';
import Navbar from '../../../components/Customer/Navbar/Navbar';
import Footer from '../../../components/Customer/Footer/Footer';
import Carousel from '../../../components/Customer/Reservation/Carousel/Carousel';
import LoginPopUp from '../../Customer/Login/Login';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Generate a single 5-digit orderId on mount
  useEffect(() => {
    const generateOrderId = () => Math.floor(10000 + Math.random() * 90000).toString();
    setOrderId(generateOrderId());
  }, []);

  return (
    <div>
      
      {/* Pass the same orderId to Navbar and Product */}
      <Navbar setShowLogin={setShowLogin} orderId={orderId} />
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
      <Header />
      <Product orderId={orderId} />
      <Carousel />
      <Footer />
    </div>
  );
};

export default Home;
