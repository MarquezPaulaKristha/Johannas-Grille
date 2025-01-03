import React, { useEffect, useState } from 'react';
import './CustomerReservationReceipt.css';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";

const CustomerReservationReceipt = ({ reservationId, onClose }) => {
  const [reservations, setReservations] = useState([]); // Always an array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reservations/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.reservations)) {
          setReservations(data.reservations); // Update reservations state with the response data
        } else {
          throw new Error('Invalid reservations data');
        }
      } catch (error) {
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Loading complete
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  // Render loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (reservations.length === 0) return <p>No reservations found.</p>;

  // Extract shared reservation details from the first row
  const { branch, reservationdate, reservationtime, numberofguests } = reservations[0];

  return (
    <div className="receipt-popup">
      <div className="receipt-popup-content">
        <button className="receipt-popup-close" onClick={onClose}>
          <IoIosCloseCircleOutline />
        </button>

        <div className="receipt-status">
          <span className="checkmark"><FaRegCheckCircle /></span>
        </div>

        <p>Your reservation at Johannas Grille is confirmed</p>
        <p>{reservationdate} at {reservationtime}</p>
        <p className="receipt-branch">Branch: {branch}</p>

        <div className="receipt-details">
          <div className="order-option">
            <span>Pax: {numberofguests}</span>
          </div>
        </div>

        <h3>Package</h3>
        <table className="package-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.qty}</td>
                <td>{item.package_price}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="total-label">Total</td>
              <td>
                {Array.isArray(reservations) && reservations.length > 0
                  ? reservations
                      .reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0)
                      .toFixed(2)
                  : '0.00'}
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Terms & Conditions</h3>
        <p className="terms">
          RESTAURANT: <br /> Please follow the restaurant's policies.
        </p>
      </div>
    </div>
  );
};

export default CustomerReservationReceipt;
