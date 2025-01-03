import React, { useState } from 'react';
import axios from "axios";
import './OrderItem.css';

const OrderItem = ({ orderid, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCompleteOrder = async () => {
    try {
      // Make a PUT or PATCH request to update the status to 'Complete'
      const response = await axios.patch(
        `http://localhost:3000/api/orders/${orderid}/status`,
        { status: 'Complete' }
      );

      // Optionally, update the order status locally or show a success message
      if (response.status === 200) {
        window.location.reload();
        // Update your local state or UI to reflect the change
      }
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete the order');
    }
  };

  return (
    <div className="em-order-item">
      <div className="em-order-header" onClick={toggleDropdown}>
        <div className="em-order-name">
          <h3>Order #{orderid}</h3>
        </div>
      </div>

      {isOpen && (
        <div className="em-order-details">
          {items.map((item, index) => (
            <div key={index} className="em-order-item-detail">
              <div className="em-item-info">
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
              </div>
              <p className="em-qty">Qty: {item.quantity}</p>
            </div>
          ))}
          <hr />
          <div className="em-order-footer">
            <div className="em-item">
              <span className="em-order-summary">{items.length} Items</span>
              <span className="em-order-total">
                Total: ${items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
              </span>
            </div>
            <div>
              <button onClick={handleCompleteOrder}>
                Complete
              </button>
              <button onClick={toggleDropdown}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
