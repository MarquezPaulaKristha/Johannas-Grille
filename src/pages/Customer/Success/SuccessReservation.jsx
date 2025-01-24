import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/Provider";
import CustomerReservationReceipt from "../../../components/Customer/Reservation/CustomerReservationReceipt/CustomerReservationReceipt";

function SuccessReservationPage() {
  const { payloadDetails, setPayloadDetails, setReservationDetails, setReserveItems,  } = useProvider();
  const [gcashNumber, setGcashNumber] = useState('');
  const [reservationId, setReservationId] = useState(payloadDetails.length > 0 ? payloadDetails[0].reservationId : null);
  const [referenceCode, setReferenceCode] = useState('');
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    try {
      const response = await axios.post("https://johannas-grille.onrender.com/api/create-reservation", payloadDetails, { //https://johannas-grille.onrender.com
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {

      }
    } catch (error) {
      alert("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    handleConfirmPayment();
  }, []);

  const handleConfirmReceipt = async () => {
    console.log('Sending payment details:', { reservationId, referenceCode, gcashNumber });
  
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/reservations/payment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, referenceCode, gcashNumber }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsReceiptVisible(true); // Show receipt after successful payment
      } else {
        console.error('Payment error:', data.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const handleShopping = () => {
    navigate("/");
  };

  const onClose = () => {
    setIsReceiptVisible(false);
    setPayloadDetails([]);
    setReserveItems([]);
    setReservationDetails(null)
    navigate("/");
  }

  return (
    <div className="payment-popup">
      <div className="payment-popup-content">

        <h2>GCash Payment Details</h2>
        <div className="form-group">
          <label htmlFor="gcashNumber">GCash Mobile Number</label>
          <input
            type="text"
            id="gcashNumber"
            value={gcashNumber}
            onChange={(e) => setGcashNumber(e.target.value)}
            placeholder="Enter your GCash number"
            maxLength="11"
          />
        </div>

        <div className="form-group">
          <label htmlFor="referenceCode">GCash Reference Code</label>
          <input
            type="text"
            id="referenceCode"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="Enter reference code"
            maxLength="12"
          />
        </div>

        <button type="submit" onClick={handleConfirmReceipt} className="payment-button">
          Confirm
        </button>

        {isReceiptVisible && (
          <CustomerReservationReceipt
            reservationId={reservationId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default SuccessReservationPage;
