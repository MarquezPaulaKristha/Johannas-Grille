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
  const [newOrderId, setOrderId] = useState('');

  // Generate orderId with current year, month, date, and a 5-digit random number
  useEffect(() => {
    const generateOrderId = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding padding for single-digit months
      const day = currentDate.getDate().toString().padStart(2, '0'); // Adding padding for single-digit days
      const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();

      console.log(`Year: ${year}, Month: ${month}, Day: ${day}, Random: ${randomDigits}`); // Debugging log

      return `${year}${month}${day}${randomDigits}`;
    };

    const newOrderId = generateOrderId();
    console.log("Generated Order ID:", newOrderId); // Log the generated order ID
    setOrderId(newOrderId);
  }, []);

  return (
    <div>
      {/* Pass the same orderId to Navbar and Product */}
      <Navbar setShowLogin={setShowLogin} newOrderId={orderId} />
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
      <Header />
      <Product newOrderId={orderId} />
      <Carousel />
      <Footer />
    </div>
  );
};

export default Home;
