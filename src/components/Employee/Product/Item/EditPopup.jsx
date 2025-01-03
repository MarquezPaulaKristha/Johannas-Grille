import React, { useState } from 'react';
import './EditPopup.css';

const EditPopup = ({ id, name, availability, onClose, onSave }) => {
  const [updatedAvailability, setUpdatedAvailability] = useState(availability);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Send updated data to the backend
      const response = await fetch(`http://localhost:3000/api/menuitems-edit-availability/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availability: updatedAvailability,
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        onSave({
          updatedAvailability: updatedItem.availability,
        });
        window.location.reload();
        onClose(); // Close the popup after successful save
      } else {
        console.error('Failed to update availability:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <div className="employee-edit-product">
      <div className="employee-edit-product-inner">
        <button onClick={onClose}>Close</button>
        <form onSubmit={handleSave}>
          {/* Name Field - Read-Only */}
          <input className="employee-edit-product-name" id="name" type="text" value={name} readOnly />

          {/* Availability Field */}
          <label htmlFor="availability" className='employee-edit-product-availability' >Availability</label>
          <select
            id="availability"
            value={updatedAvailability}
            onChange={(e) => setUpdatedAvailability(e.target.value)}
            className='employee-edit-product-availability'
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {/* Save Button */}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;
