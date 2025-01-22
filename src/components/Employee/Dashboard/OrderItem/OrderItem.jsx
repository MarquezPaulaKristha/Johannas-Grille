import React, { useState } from "react";
import axios from "axios";
import "./OrderItem.css";

const OrderItem = ({ orderid, items = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAmount = items
    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  const handleCompleteOrder = async () => {
    try {
      await axios.patch(
        `https://johannas-grille.onrender.com/api/orders/${orderid}/status`,
        { status: "Complete" }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Failed to complete the order");
    }
  };

  return (
    <div className="emp-order-card">
      {/* Header section is always visible */}
      <div
        className="emp-order-header"
        onClick={() => setIsExpanded(!isExpanded)} // Toggle visibility
      >
        <div className="emp-order-header-info">
          <h3>Order #{orderid.slice(-5)}</h3>
          <span className="emp-order-date">23 Feb 2021, 07:28 PM</span>
        </div>
        <div className="emp-user-icon">😊</div>
      </div>

      {/* Rest of the content is conditionally displayed */}
      {isExpanded && (
        <>
          <div className="emp-order-items">
            {items.map((item, index) => (
              <div key={index} className="emp-order-item">
                <div className="emp-item-info">
                  <h4>{item.name}</h4>
                  <span>₱{parseFloat(item.price).toFixed(2)}</span>
                </div>
                <span className="emp-item-quantity">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="emp-order-summary">
            <div className="emp-prices">
              <h6>{items.length} Items</h6>
              <span>Total: ₱{totalAmount}</span>
            </div>
            <div className="emp-action-buttons">
              <button className="emp-reject-btn">❌</button>
              <button className="emp-approve-btn" onClick={handleCompleteOrder}>
                ✅
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderItem;
