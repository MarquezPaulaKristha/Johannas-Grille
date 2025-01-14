import React from 'react';
import './AdminDelProduct.css';

const DeletePopup = ({ productId, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://johannas-grille.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product with ID: ${productId}`);
      }

      const data = await response.json();
      console.log('Product deleted:', data);

      onDelete(); // Call the parent delete handler to reload data
      onClose();  // Close the popup after successful deletion

      window.location.reload();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h3>Are you sure you want to delete this item?</h3>
        <div className="delete-popup-buttons">
          <button className="confirm-btn" onClick={handleDelete}>Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
