import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlaceOrderPopup.css";
import { useProvider } from "../../../../global_variable/Provider";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

const PlaceOrderPopup = ({ onCancel, branch }) => {
  const { orderItems, setOrderItems, customername, setcustomername, orderType, setOrderType, selectedEmployeeBranch, setBranch } = useProvider();
  const [receivedAmount, setReceivedAmount] = useState("");
  const activeBranch = branch || selectedEmployeeBranch;
  const navigate = useNavigate(); // <-- Initialize useNavigate

  useEffect(() => {
    if (branch) {
      setBranch(branch);
    }
  }, [branch, setBranch]);

  const totalPrice = orderItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const change = receivedAmount ? Math.max(0, receivedAmount - totalPrice) : 0;

  const handleReceivedAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setReceivedAmount(isNaN(value) ? "" : value);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      currentDate: now.toISOString().split("T")[0], // YYYY-MM-DD
      currentTime: now.toTimeString().split(" ")[0], // HH:mm:ss
    };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const handleConfirmPayment = async () => {
    if (!customername) {
      alert("Please enter a name.");
      return;
    }
  
    if (orderItems.length === 0) {
      alert("No items in the order.");
      return;
    }
  
    const orderData = {
      customerid: "00000",
      orderItems: orderItems.map((item) => ({
        orderid: item.orderid,
        menuitemid: item.menuitemid,
        order_quantity: item.quantity,
      })),
      totalamount: totalPrice,
      ordertype: orderType,
      date: currentDate,
      time: currentTime,
      customername: customername,
      status: "Pending",
      selectedBranch: activeBranch,
    };
  
    try {
      const response = await axios.post(
        "https://johannas-grille.onrender.com/api/create-order",
        orderData
      );
  
      if (response.status === 200) {
        // Set the branch in the global state before navigating
        setBranch(activeBranch);
  
        // Navigate to the SuccessPage and pass the branch as state
        navigate("/employee/success", { state: { branch: activeBranch } }); // <-- Pass branch here
  
        // Reset the state
        setOrderItems([]);
        setcustomername("");
        setOrderType("Dine In");
        onCancel();
      }
    } catch (error) {
      console.error("Failed to create order:", error.response?.data || error.message);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="place-order-popup">
      <div className="place-order-popup-inner">
        <h2>Confirm Your Order</h2>
        <ul className="order-items-list">
          {orderItems.map((item) => (
            <li key={item.menuitemid}>
              <div className="orderitems">
                <div className="orderitem-info">
                  <h4>{item.quantity}x</h4>
                  <h4>{item.name}</h4>
                </div>
                <div className="orderitem-price">
                  <p>Price: P{Number(item.price) ? Number(item.price).toFixed(2) : "N/A"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p>Order Type: <strong>{orderType}</strong></p>
        <p>Total Items: <strong>{orderItems.length}</strong></p>
        <p>Total Price: <strong>P{totalPrice.toFixed(2)}</strong></p>
        <p>Change: <strong>P{change.toFixed(2)}</strong></p>
        <div className="emp-table-number">
          <label>
            Name:
            <input
              type="text"
              value={customername}
              onChange={(e) => setcustomername(e.target.value)}
              placeholder="Enter name"
            />
          </label>
          <label>
            Amount Received:
            <input
              type="number"
              min="0"
              step="0.01"
              value={receivedAmount}
              onChange={handleReceivedAmountChange}
              placeholder="Enter amount"
            />
          </label>
        </div>
        <div className="place-order-buttons">
          <button
            className="confirm-button"
            onClick={handleConfirmPayment}
            disabled={receivedAmount < totalPrice || orderItems.length === 0}
          >
            Confirm Order
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPopup;