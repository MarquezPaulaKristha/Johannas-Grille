import React from 'react';
import './CustomerReservationTransaction.css';

const CustomerReservationTransaction = () => {
  const reservations = [
    {
      package: 'Package 1',
      date: '01-20-2025',
      time: '12:00',
      price: 4500,
      bundle: ['Menu A', 'Menu B'],
    },
    {
      package: 'Package 2',
      date: '01-20-2025',
      time: '12:00',
      price: 6000,
      bundle: ['Menu A', 'Menu B', 'Menu D'],
    },
  ];

  return (
    <div className="customer-reservation-transaction" id="reservations">
      <h1 className="reservation-header">Reservation Transactions</h1>
      <div className="reservation-cards-container">
        {reservations.map((reservation, index) => (
          <div className="reservation-card" key={index}>
            <div className="reservation-card-header">
              <h2>{reservation.package}</h2>
            </div>
            <div className="reservation-card-content">
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Price:</strong> ₱{reservation.price.toFixed(2)}</p>
              <p><strong>Bundle:</strong> {reservation.bundle.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReservationTransaction;
