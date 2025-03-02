import React, { useState }from "react";
// import { assets } from '../../assets/assets'
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import './ProductPayment.css';
import ProductReceipt from "../PaymentReceipt/PaymentReceipt";
import { useProvider } from "../../../../global_variable/Provider";

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
          branch: selectedBranch,
          pickupDate: new Date().toISOString().split('T')[0], // Example date
          pickupHour: '12:00' // Example time
        };
      
        try {
          // Step 1: Initiate GCash payment
          const paymentResponse = await axios.post('https://johannas-grille.onrender.com/api/customer-gcash-checkout', body);
          const { url } = paymentResponse.data;
      
          // Step 2: Insert order into the database
          const orderData = {
            orderid: generateOrderId(), // Generate a unique order ID
            customerid: customer.id, // Assuming customer object has an `id` field
            ordertype: 'Online', // Example order type
            date: new Date().toISOString().split('T')[0], // Current date
            totalamount: cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2),
            time: new Date().toTimeString().split(' ')[0], // Current time
            status: 'Pending', // Initial status
            customername: customer.name, // Assuming customer object has a `name` field
            branch: selectedBranch
          };
      
          // Insert order into the database
          await axios.post('https://johannas-grille.onrender.com/api/insert-order', orderData);
      
          // Step 3: Redirect to payment URL
          window.location.href = url;
        } catch (error) {
          console.error('Error initiating payment:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
            alert(`Payment failed: ${error.response.data.error || 'Unknown error'}`);
          } else {
            alert('Failed to initiate payment. Please try again later.');
          }
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
