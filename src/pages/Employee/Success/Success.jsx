import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/provider";

function SuccessPage() {
  const { orderItems, setOrderItems, tableNumber, setTableNumber, orderType, setOrderType } = useProvider();
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  const totalPrice = orderItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const getCurrentDateTime = () => {
    const now = new Date();

    // Format the date as YYYY-MM-DD
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0]; // HH:mm:ss

    return { currentDate, currentTime };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    const orderData = {
      customerid: "0000",
      orderItems: orderItems.map(item => ({
        orderid: item.orderid,
        menuitemid: item.menuitemid,
        order_quantity: item.quantity,
      })),
      totalamount: totalPrice,
      ordertype: orderType,
      date: currentDate,
      time: currentTime,
      tableno: tableNumber,
      status: "Pending",
    };

    try {
      const response = await axios.post("http://localhost:3000/api/create-order", orderData);
      if (response.status === 200) {
        setOrderItems([]);
        setTableNumber("");
        setOrderType("Dine In");
      }
    } catch (error) {
      alert("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    handleConfirmPayment();
  }, []);

  const handleShopping = () => {
    navigate("/employee/order");
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <div className="success-icon">₱</div>
        <h1 className="mt-3">Payment Successful</h1>
        <p className="payment-message">Thank you for your payment!</p>
        <button className="success-button" onClick={handleShopping}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
