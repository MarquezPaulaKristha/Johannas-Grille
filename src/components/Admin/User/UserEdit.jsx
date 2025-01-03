// EditModal.js
import React, { useState } from "react";
import './Users.css';

const EditModal = ({ show, setShow, transaction, updateTransaction }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({ ...editedTransaction, [name]: value });
  };

  const handleSubmit = () => {
    updateTransaction(editedTransaction);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Transaction</h2>
        <input
          name="name"
          placeholder="Name"
          value={editedTransaction.name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={editedTransaction.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={editedTransaction.email}
          onChange={handleChange}
        />
        <input
          name="branch"
          placeholder="Branch"
          value={editedTransaction.branch}
          onChange={handleChange}
        />
        <input
          name="date"
          placeholder="Date"
          value={editedTransaction.date}
          onChange={handleChange}
        />
        <input
          name="time"
          placeholder="Time"
          value={editedTransaction.time}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={editedTransaction.amount}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Update Transaction</button>
        <button onClick={() => setShow(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;