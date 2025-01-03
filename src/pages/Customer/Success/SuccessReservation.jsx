import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/provider";

function SuccessReservationPage() {
  const { payloadDetails, setPayloadDetails, setReservationDetails, setReserveItems,  } = useProvider();
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    try {
      const response = await axios.post("http://localhost:3000/api/create-reservation", payloadDetails, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setPayloadDetails([]);
        setReserveItems([]);
        setReservationDetails(null)
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
        <div className="success-icon">✔</div>
        <h1 className="mt-3">Payment Successful</h1>
        <p className="payment-message">Thank you for your Reservation!</p>
        <button className="success-button" onClick={handleShopping}>
          Order more
        </button>
      </div>
    </div>
  );
}

export default SuccessReservationPage;
