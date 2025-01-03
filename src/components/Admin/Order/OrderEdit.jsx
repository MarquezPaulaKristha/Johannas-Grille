import React from "react";
import './OrderEdit.css';

const OrderEdit = ({ selectedOrder, setSelectedOrder, handleFormSubmit, handleCloseModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Order</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Product Name:
            <input
              type="text"
              value={selectedOrder?.name || ""}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, name: e.target.value })
              }
            />
          </label>
          <label>
            Status:
            <select
              value={selectedOrder?.status || ""}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, status: e.target.value })
              }
            >
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
          <label>
            Amount:
            <input
              type="number"
              value={selectedOrder?.amount || ""}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, amount: e.target.value })
              }
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCloseModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderEdit;