import React, { useState, useEffect } from 'react';
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
  const [isOrderIdGenerated, setIsOrderIdGenerated] = useState(false); // To check if orderId is generated

  // Generate orderId with current year, month, date, and a 5-digit random number
  useEffect(() => {
    const generateOrderId = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding padding for single-digit months
      const day = currentDate.getDate().toString().padStart(2, '0'); // Adding padding for single-digit days
      const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();

      return `${year}${month}${day}${randomDigits}`;
    };

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setIsOrderIdGenerated(true); // Set to true once orderId is generated
  }, []);

  return (
    <div>
      {isOrderIdGenerated ? (
        <>
          {/* Pass the orderId to Navbar and Product once it's generated */}
          <Navbar setShowLogin={setShowLogin} orderId={orderId} />
          {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
          <Header />
          <Product orderId={orderId} />
          <Carousel />
          <Footer />
        </>
      ) : (
        <p>Loading...</p> // You can show a loading spinner or a message until the orderId is generated
      )}
    </div>
  );
};

export default Home;
