import React from 'react';
import './DeleteCustomer.css';

const DeleteCustomerPopup = ({ customerID, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://johannas-grille.onrender.com/api/customer/${customerID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer with ID: ${customerID}`);
      }

      const data = await response.json();
      console.log('Customer deleted:', data);

      onDelete(); // Call the parent delete handler to reload data
      onClose();  // Close the popup after successful deletion

      window.location.reload();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="delete-customer-popup">
      <div className="delete-customer-popup-inner">
        <h3>Are you sure you want to delete this item?</h3>
        <div className="delete-customer-popup-buttons">
          <button className="delete-customer-confirm-btn" onClick={handleDelete}>Delete</button>
          <button className="delete-customer-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerPopup;
