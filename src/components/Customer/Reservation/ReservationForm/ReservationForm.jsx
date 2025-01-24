import React, { useState } from 'react';
import './ReservationForm.css';
import CustomerReservationMenu from '../CustomerReservationMenu/CustomerReservationMenu';
import CustomerReservationReceipt from '../CustomerReservationReceipt/CustomerReservationReceipt'; // Import the receipt component
import TermsAndConditions from '../CustomerTerms&Condition/CustomerTerms&Condition';
import { useProvider } from '../../../../global_variable/Provider';

const ReservationForm = ({ reservationId, onClose }) => {
  const { reservationDetails, setReservationDetails, customer } = useProvider();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false); // To control the Terms and Conditions popup
  const [isReceiptOpen, setIsReceiptOpen] = useState(false); // New state for receipt
  const branchOptions = ['Batangas', 'Bauan'];

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTerms(true); // Show the Terms and Conditions popup
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!customer) {
      alert('Please sign in first!');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }

    const formData = {
      reservationId: reservationId,
      numberofguests: e.target.guests.value,
      reservationdate: e.target.date.value,
      reservationtime: e.target.time.value,
      branch: e.target.branch.value,
    };

    setReservationDetails(formData); // Directly update the reservation details
    setIsSubmitted(true); // Mark the form as submitted
  };

  const handleCloseTerms = () => {
    setShowTerms(false); // Close the Terms and Conditions popup
  };

  return (
    <>
      {/* Terms and Conditions Popup */}
      {showTerms && <TermsAndConditions onClose={handleCloseTerms} />}

      {/* Receipt Popup */}
      {isReceiptOpen && (
        <CustomerReservationReceipt
          reservationId={reservationId}
          onClose={() => setIsReceiptOpen(false)} // Close the receipt popup
        />
      )}

      {/* Reservation Form */}
      {!isSubmitted && !showTerms && (
        <div className="res-modal-overlay">
          <div className="res-modal-content modern">
            <h1>{reservationId}</h1>
            <h2 className="res-title modern"> Make a Reservation</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="res-form-grid modern">
                <div className="res-form-group">
                  <label htmlFor="guests">Guests</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    placeholder="Number of Guests"
                    min="50"
                    required
                  />
                </div>
                <div className="res-form-group">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" name="date" required />
                </div>
                <div className="res-form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    min="09:30"
                    max="20:30"
                    required
                  />
                </div>
                <div className="res-form-group">
                  <label htmlFor="branch">Branch</label>
                  <select id="branch" name="branch" required>
                    <option value="">Select a branch</option>
                    {branchOptions.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="res-form-group" id="term">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    onChange={handleCheckboxChange}
                    required
                  />
                  <label htmlFor="terms">
                    I accept the{' '}
                    <a href="#" onClick={handleTermsClick} className="terms-condition">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="res-buttons">
                <button className="res-button modern" type="submit">
                  Submit
                </button>
                <button className="res-cancel-button modern" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Reservation Menu */}
      {isSubmitted && (
        <CustomerReservationMenu
          reservationDetails={reservationDetails}
          onClose={onClose}
          reservationId={reservationId}
        />
      )}
    </>
  );
};

export default ReservationForm;
