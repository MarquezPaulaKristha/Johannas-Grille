import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("pickup"); // Default active tab
  const [pickupTransactions, setPickupTransactions] = useState([]);
  const [reservationTransactions, setReservationTransactions] = useState([]);

  // Fetch Pickup Transactions
  useEffect(() => {
    const fetchPickupTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pickup");
        if (response.ok) {
          const data = await response.json();
          setPickupTransactions(data);
        } else {
          console.error("Failed to fetch Pickup Transactions");
        }
      } catch (error) {
        console.error("Error fetching Pickup Transactions:", error);
      }
    };

    fetchPickupTransactions();
  }, []);

  // Fetch Reservation Transactions
  useEffect(() => {
    const fetchReservationTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/reservations");
        if (response.ok) {
          const data = await response.json();
          setReservationTransactions(data);
        } else {
          console.error("Failed to fetch Reservation Transactions");
        }
      } catch (error) {
        console.error("Error fetching Reservation Transactions:", error);
      }
    };

    fetchReservationTransactions();
  }, []);

  return (
    <div className="navbar">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "pickup" ? "active" : ""}`}
          onClick={() => setActiveTab("pickup")}
        >
          Pickup
        </button>
        <button
          className={`tab ${activeTab === "reservation" ? "active" : ""}`}
          onClick={() => setActiveTab("reservation")}
        >
          Reservation
        </button>
      </div>

      <div className="transactions">
        {activeTab === "pickup" && (
          <div className="transaction-list">
            <h2>Pickup Transactions</h2>
            {pickupTransactions.length > 0 ? (
              <ul>
                {pickupTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <strong>Order ID:</strong> {transaction.orderId},{" "}
                    <strong>Customer:</strong> {transaction.customerName},{" "}
                    <strong>Time:</strong> {transaction.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Pickup Transactions</p>
            )}
          </div>
        )}

        {activeTab === "reservation" && (
          <div className="transaction-list">
            <h2>Reservation Transactions</h2>
            {reservationTransactions.length > 0 ? (
              <ul>
                {reservationTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <strong>Reservation ID:</strong> {transaction.reservationId},{" "}
                    <strong>Customer:</strong> {transaction.customerName},{" "}
                    <strong>Date:</strong> {transaction.date},{" "}
                    <strong>Time:</strong> {transaction.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Reservation Transactions</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
