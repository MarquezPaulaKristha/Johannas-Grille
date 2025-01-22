import React, { useState, useEffect } from 'react';
import './CustomerReservationTransaction.css';
import { useProvider } from '../../../../global_variable/Provider';
import axios from "axios";
import { format } from 'date-fns';

const CustomerReservationTransaction = () => {
  const { customer } = useProvider();
  const [reservations, setReservations] = useState([]);

  const fetchReservation = async () => {
    if (!customer?.customerid) {
      alert('Sign in first!');
      return;
    }

    try {
      const result = await axios.get(`https://johannas-grille.onrender.com/api/customer/reservation-details/${customer.customerid}`);
      if (result.status === 200) {
        setReservations(result.data);
      }
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  return (
    <div className="customer-reservation-transaction" id="reservations">
      <h1 className="reservation-header">Reservation Transactions</h1>
      <div className="reservation-cards-container">
        {reservations.map((reservation) => (
          <div className="reservation-card" key={reservation.reservationid}>
            <div className="reservation-card-header">
              <h2>{reservation.package}</h2>
            </div>
            <div className="reservation-card-content">
              <p><strong>Date:</strong> {format(new Date(reservation.reservationdate), 'dd/MM/yyyy')}</p>
              <p><strong>Time:</strong> {reservation.reservationtime}</p>
              <p><strong>Price:</strong> ₱{reservation.amount}</p>
              <p><strong>Bundle:</strong> {reservation.menu_names}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReservationTransaction;
