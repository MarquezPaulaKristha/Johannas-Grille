import React, { useState, useEffect } from 'react';
import './InventoryAdd.css';

const InventoryAdd = ({ productId, quantity, invid, onClose, onSave, name }) => {
  const [additionalQuantity, setAdditionalQuantity] = useState(''); // State for input quantity
  const [categories, setCategories] = useState([]); // Categories from DB

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Error fetching categories:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Calculate the new total quantity
    const newQuantity = parseInt(quantity) + parseInt(additionalQuantity);

    try {
      const response = await fetch(`https://johannas-grille.onrender.com/api/inventory/${invid}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }), // Send the updated quantity
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Inventory updated:', result);
        if (onSave) onSave(result); // Callback to parent
        onClose(); // Close the modal
      } else {
        console.error('Error updating inventory:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  return (
    <div className="inv-edit-popup">
      <div className="inv-edit-popup-inner">
        <h2>Edit Inventory Item</h2>
        <form onSubmit={handleFormSubmit}>
          <label>Product Name</label>
          <input type="text" value={name} readOnly />

          <label>Current Quantity</label>
          <input type="number" value={quantity} readOnly />

          <label>Additional Quantity</label>
          <input
            type="number"
            value={additionalQuantity}
            onChange={(e) => setAdditionalQuantity(e.target.value)}
            required
          />

          <div className="inv-edit-popup-buttons">
            <button type="submit" className="inv-save-button">
              Save Changes
            </button>
            <button type="button" className="inv-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryAdd;