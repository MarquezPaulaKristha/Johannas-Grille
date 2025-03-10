import React, { useState, useEffect } from "react";
import OrderAction from "./ReservationEdit";
import OrderPagination from "../OrderPagination/OrderPagination"; // Import the Pagination component
import "./Reservation.css";

const Orders = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isReservationPopupOpen, setIsReservationPopupOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationItems, setReservationItems] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust the number of items per page

  const fetchReservation = () => {
    fetch("https://johannas-grille.onrender.com/api/reservations")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.reservationdate);
          const dateB = new Date(b.reservationdate);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
          const timeA = new Date(`1970-01-01T${a.reservationtime}`);
          const timeB = new Date(`1970-01-01T${b.reservationtime}`);
          if (timeA < timeB) return 1;
          if (timeA > timeB) return -1;
          return 0;
        });
        setReservation(sortedData);
      })
      .catch((error) => console.error("Error fetching reservation data:", error));
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservation.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservation.length / itemsPerPage);

  const handleOpen = (reservation) => {
    console.log("Fetching reservation items for:", reservation.reservationid);

    fetch(`https://johannas-grille.onrender.com/api/reservation-items/${reservation.reservationid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched reservation items:", data); // Debugging

        if (data.length > 0) {
          const firstItem = data[0]; // Get customer details from the first row

          setCurrentItem({
            reservation,
            firstname: firstItem.firstname || "N/A",
            lastname: firstItem.lastname || "N/A",
            phonenumber: firstItem.phonenumber || "N/A",
            email: firstItem.email || "N/A",
            address: firstItem.address || "N/A"
          });

          setReservationItems(data);
          setIsReservationPopupOpen(true);
        } else {
          console.error("No reservation items found for this reservation.");
        }
      })
      .catch((error) => console.error("Error fetching reservation data:", error));
  };

  const handleEdit = (reservation) => {
    setCurrentItem(reservation);
    setIsEditPopupOpen(true);
  };

  const handleDelete = (reservation) => {
    setCurrentItem(reservation);
    setIsDeletePopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setCurrentItem(null);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setCurrentItem(null);
  };

  const closeTablePopup = () => {
    setIsReservationPopupOpen(false);
  };

  const confirmDelete = () => {
    console.log("Item deleted:", currentItem);
    closeDeletePopup();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Edited Item:", currentItem);
    closeEditPopup();
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="res-content-wrapper">
      <h1>Reservation Page</h1>
      <section className="or-content-area-table">
        <div className="or-data-table-diagram">
          <table>
            <thead>
              <tr>
                <th>OrderID</th>
                <th>CustomerID</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                {/* <th>Branch</th> */}
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((dataItem) => {
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
                  <tr key={dataItem.reservationid}>
                    <td>{dataItem.reservationid}</td>
                    <td>{dataItem.customerid}</td>
                    <td>{dataItem.numberofguests}</td>
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                    {/* <td>{dataItem.branch}</td> */}
                    <td>{dataItem.amount}</td>
                    <td className="or-dt-cell-action">
                      <OrderAction
                        onOpen={() => handleOpen(dataItem)}
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

      {isReservationPopupOpen && currentItem && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Reservation Details</h2>
            <p><strong>Name:</strong> {currentItem.firstname} {currentItem.lastname}</p>
            <p><strong>Phone:</strong> {currentItem.phonenumber}</p>
            <p><strong>Email:</strong> {currentItem.email}</p>
            <p><strong>Address:</strong> {currentItem.address}</p>

            {/* Group reservation items by package (if applicable) */}
            {reservationItems.length > 0 ? (
              (() => {
                // Identify package based on the menuitemid
                let packageName = "Uncategorized"; // Default if no matching ID is found

                const menuItemIds = reservationItems.map(item => item.menuitemid);

                if (menuItemIds.includes(1)) {
                  packageName = "Menu A";
                } else if (menuItemIds.includes(14)) {
                  packageName = "Menu B";
                } else if (menuItemIds.includes(35)) {
                  packageName = "Menu C";
                } else if (menuItemIds.includes(59)) {
                  packageName = "Menu D";
                }

                return (
                  <div>
                    <h3>{packageName}</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservationItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.item_name}</td>
                            <td>{item.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            ) : (
              <p>No items found for this reservation.</p>
            )}
            <button className="cancel-btn" onClick={closeTablePopup}>Close</button>
          </div>
        </div>
      )}


      {/* Edit, Delete, and Reservation Popups here */}
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Edit Reservation</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Form fields */}
              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={closeEditPopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Delete Order</h2>
            <p>Are you sure you want to delete this order?</p>
            <p><strong>Order ID: {currentItem?.reservationid}</strong></p>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeDeletePopup}>Cancel</button>
              <button type="button" className="delete-confirm-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination component */}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
