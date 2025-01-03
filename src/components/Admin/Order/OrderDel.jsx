// OrderDelete.js
import React from "react";
import "./OrderDel.css"; // Create this CSS file for styling if needed

const OrderDelete = ({ selectedOrder, handleCloseModal, handleDeleteOrder }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Delete Order</h2>
        <p>Are you sure you want to delete this order?</p>
        <p>
          <strong>Order ID:</strong> {selectedOrder?.order_id}
        </p>
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button
            className="modal-btn del-btn"
            onClick={() => handleDeleteOrder(selectedOrder?.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDelete; 