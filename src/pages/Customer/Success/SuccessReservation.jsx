import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/Provider";
import CustomerReservationReceipt from "../../../components/Customer/Reservation/CustomerReservationReceipt/CustomerReservationReceipt";

function SuccessReservationPage() {
  const { payloadDetails, setPayloadDetails, setReservationDetails, setReserveItems } = useProvider();
  const [reservationId, setReservationId] = useState(payloadDetails.length > 0 ? payloadDetails[0].reservationId : null);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  // Step 1: Create the reservation
  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    try {
      const response = await axios.post("https://johannas-grille.onrender.com/api/create-reservation", payloadDetails, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // Successfully created reservation, now trigger the receipt
        setReservationId(response.data.reservation_id); // Assuming response has reservationId
        // Step 2: Proceed to show receipt
        setIsReceiptVisible(true);
      }
    } catch (error) {
      alert("Failed to create reservation. Please try again.");
    }
  };

  useEffect(() => {
    handleConfirmPayment();
  }, []); // Run only once on mount

  const handleShopping = () => {
    navigate("/");
  };

  const onClose = () => {
    setIsReceiptVisible(false);
    setPayloadDetails([]);
    setReserveItems([]);
    setReservationDetails(null);
    navigate("/");
  };

  return (
    <div className="payment-popup">
      <div className="payment-popup-content">
        <h2>Reservation Confirmed!</h2>
        <p>Your reservation has been successfully created.</p>

        {isReceiptVisible && (
          <CustomerReservationReceipt
            reservationId={reservationId}
            onClose={onClose}
          />
        )}

        {!isReceiptVisible && (
          <button onClick={handleShopping} className="payment-button">
            Go to Home
          </button>
        )}
      </div>
    </div>
  );
}

export default SuccessReservationPage;
