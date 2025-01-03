import React, { useState, useEffect } from "react";
import OrderAction from "./ReservationEdit"; // Import the OrderAction component
import "./Reservation.css";

const Orders = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [reservation, setReservation] = useState([]);


  const fetchReservation = () => {
    fetch("http://localhost:3000/api/reservations")
      .then((response) => response.json())
      .then((data) => setReservation(data))
      .catch((error) => console.error("Error fetching employee data:", error));
  };

  useEffect(() => {
    fetchReservation();
  }, []);


  const handleEdit = (reservation) => {
    setCurrentItem(reservation);
    setIsEditPopupOpen(true);
  };

  const handleDelete = (reservation) => {
    setCurrentItem(reservation);
    setIsDeletePopupOpen(true); // Open the delete confirmation popup
  };

  // Function to close the edit popup
  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setCurrentItem(null); // Clear the current reservation after closing
  };

  // Function to close the delete popup
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setCurrentItem(null); // Clear the current reservation after closing
  };

  // Function to handle delete confirmation
  const confirmDelete = () => {
    console.log("Item deleted:", currentItem);
    // Add your deletion logic here (e.g., API call to delete the reservation)
    closeDeletePopup(); // Close the delete popup after deletion
  };

  // Function to handle form submit for editing
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Edited Item:", currentItem);
    // Here you can make an API call to save the edited changes
    closeEditPopup(); // Close the edit popup after saving
  };

  return (
    <div className="res-content-wrapper">
      <h1>Reservation Page</h1>
      <section className="or-content-area-table">
        <div className="or-data-table-info">
          <h1 className="or-data-table-title">Lists</h1>
        </div>
        <div className="or-data-table-diagram">
          <table>
            <thead>
              <tr>
                <th>CustomerID</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                <th>Branch</th>
                <th>Amount</th>
                <th>PaymentMethod</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservation.map((dataItem) => {
                const formattedDate = new Date(dataItem.reservationdate).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                const formattedTime = new Date(`1970-01-01T${dataItem.reservationtime}`).toLocaleTimeString("en-US", {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

                return (
                  <tr key={dataItem.id}>
                    <td>{dataItem.customerid}</td>
                    <td>{dataItem.numberofguests}</td>
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                    <td>{dataItem.branch}</td>
                    <td>{dataItem.amount}</td>
                    <td>{dataItem.paymentmethod}</td>
                    <td>
                      <div className="or-dt-status">
                        <span className={`or-dt-status-dot dot-${dataItem.status}`}></span>
                        <span className="or-dt-status-text">{dataItem.status}</span>
                      </div>
                    </td>
                    <td className="or-dt-cell-action">
                      <OrderAction
                        onEdit={() => handleEdit(dataItem)}
                        onDelete={() => handleDelete(dataItem)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Popup Form */}
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Edit Reservation</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={currentItem?.name || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={currentItem?.phone || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={currentItem?.email || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <input
                  type="text"
                  id="branch"
                  value={currentItem?.branch || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, branch: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={currentItem?.status || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, status: e.target.value })
                  }
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={currentItem?.amount || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, amount: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button type="button" className="cancel-btn" onClick={closeEditPopup}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Delete Order</h2>
            <p>Are you sure you want to delete this order?</p>
            <p><strong>Order ID: {currentItem?.id}</strong></p>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeDeletePopup}>
                Cancel
              </button>
              <button type="button" className="delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;