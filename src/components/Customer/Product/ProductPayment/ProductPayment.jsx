import React, { useState }from "react";
// import { assets } from '../../assets/assets'
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import './ProductPayment.css';
import ProductReceipt from "../PaymentReceipt/PaymentReceipt";
import { useProvider } from "../../../../global_variable/provider";

const ProductPayment = ({ onClose }) => {
    const { cartItems, selectedBranch, customer } = useProvider();
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
    
      const handleConfirmPayment = async () => {
        console.log(customer);
        if (!customer) {
          alert(`Please sign in first!`);
          return;
        }

        const body = {
            lineItems: cartItems.map(item => ({
                quantity: item.quantity,
                name: item.name,
                price: item.price
            })),
        };

        try {
            const response = await axios.post('http://localhost:3000/api/customer-gcash-checkout', body);

            const { url } = response.data;

            window.location.href = url;
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
      };
    
  return (
    <div className="order">
      <div className="order-container">
        <header className="order-header">
          <i className="back-arrow" onClick={onClose}>
              <IoIosArrowBack size={33} />
          </i>
          <h2>My Cart</h2>
        </header>

        <section className="order-branch">
          <i className="location-icon"><TbBrandGoogleMaps size={33} /></i>
          <span>{selectedBranch === 'Bauan' ? 'Main Branch, Bauan Batangas' : 'Branch 2: Batangas City'}</span>
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
          <p>P{cartItems
                .reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0)
                .toFixed(2)}</p>
        </div>
        <div className="fin-bott">
          <button className="finalize-btn" onClick={handleConfirmPayment}>CONFIRM ORDER</button>
          {showReceipt && < ProductReceipt />} 
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;
