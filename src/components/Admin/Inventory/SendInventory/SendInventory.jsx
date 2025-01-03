import React, { useState } from 'react';
import './SendInventory.css';

const SendInventory = ({ itemName, onConfirm, onCancel }) => {
  const [quantityToSend, setQuantityToSend] = useState('');

  const handleSubmit = () => {
    if (quantityToSend && parseInt(quantityToSend, 10) > 0) {
      onConfirm(quantityToSend); // Pass the quantity to the confirm handler
    } else {
      alert('Please enter a valid quantity to send.');
    }
  };

  return (
    <div className="send-popup">
      <div className="send-popup-inner">
        <h2>Send Inventory</h2>
        <p>How many units of <strong>{itemName}</strong> would you like to send?</p>
        <input
          type="number"
          min="1"
          placeholder="Enter quantity"
          value={quantityToSend}
          onChange={(e) => setQuantityToSend(e.target.value)}
        />
        <div className="send-popup-buttons">
          <button className="send-confirm-button" onClick={handleSubmit}>
            Confirm
          </button>
          <button className="send-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendInventory;