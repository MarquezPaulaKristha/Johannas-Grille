import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/provider";

function SuccessCustomerPage() {
  const { cartItems, setCartItems, customer, pickupHour, setPickupHour, pickupDate, setPickupDate } = useProvider();
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    const orderData = {
      customerid: customer.customerid,
      orderItems: cartItems.map(item => ({
        orderid: item.orderid,
        menuitemid: item.menuitemid,
        order_quantity: item.quantity,
      })),
      totalamount: totalPrice,
      ordertype: 'Pickup',
      date: pickupDate,
      time: `${pickupHour}:00`,
      tableno: '00000',
      status: "Pending",
    };

    try {
      const response = await axios.post("http://localhost:3000/api/create-order", orderData);
      if (response.status === 200) {
        setCartItems([]);
        setPickupHour("12:00");
        setPickupDate(new Date().toISOString().substring(0, 10))
      }
    } catch (error) {
      alert("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    handleConfirmPayment();
  }, []);

  const handleShopping = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <div className="success-icon">₱</div>
        <h1 className="mt-3">Payment Successful</h1>
        <p className="payment-message">Thank you for your payment!</p>
        <button className="success-button" onClick={handleShopping}>
          Order more
        </button>
      </div>
    </div>
  );
}

export default SuccessCustomerPage;
