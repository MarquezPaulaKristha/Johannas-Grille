import React, { useState }from "react";
// import { assets } from '../../assets/assets'
import { IoIosArrowBack } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import './Payment.css';
import Receipt from "../Receipt/Receipt";

const Payment = () => {

    const [isVisible, setIsVisible] = useState(true);
    const [showReceipt, setShowReceipt] = useState(false); 

    const handleClick = () => {
      setShowReceipt(true); // Set showCart to true when the button is clicked
    };

    const handleClose = () => {
        setIsVisible(false);  // Hide the cart
      };
    
      if (!isVisible) {
        return null; // Don't render the cart if it's not visible
      }
    
  return (
    <div className="order">
      <div className="order-container">
        <header className="order-header">
          <i className="back-arrow" onClick={handleClose}>
              <IoIosArrowBack size={33} />
          </i>
          <h2>My Cart</h2>
        </header>

        <section className="order-branch">
          <i className="location-icon"><TbBrandGoogleMaps size={33} /></i>
          <span>Main Branch, Bauan Batangas City</span>
          <i className="down-icon"><IoIosArrowDown size={30} /></i>
        </section>
        <h6>Payment Method</h6>
        <div className="order-items">
          <div className="order-item">
          <p>GCASH</p>
          </div>
        </div>

  
        <div className="order-summary">
          <p>Total</p>
          <p>P745.00</p>
        </div>
        <div className="fin-bott">
          <button className="finalize-btn" onClick={handleClick}>CONFIRM ORDER</button>
          {showReceipt && < Receipt />} 
        </div>
      </div>
    </div>
  );
};

export default Payment;
