import React from 'react';
import './DeleteEmployee.css';

const DeleteModal = ({ employeeId, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete employee with ID: ${employeeId}`);
      }

      await response.json();
      console.log('Employee deleted successfully');

      onDelete(); // Call the parent delete handler to reload data
      onClose();  // Close the popup after successful deletion
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="delete-employee-popup">
      <div className="delete-employee-popup-inner">
        <h3>Are you sure you want to delete this employee?</h3>
        <div className="delete-employee-popup-buttons">
          <button className="delete-employee-confirm-btn" onClick={handleDelete}>Delete</button>
          <button className="delete-employee-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
