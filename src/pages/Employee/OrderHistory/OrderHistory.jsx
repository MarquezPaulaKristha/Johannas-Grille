import React, { useState, useEffect } from "react";
import OrderHistory from '../../../components/Employee/OrderHistory/OrderHistory';
import OrderDataRange from "../../../components/Admin/OrderDataRange/OrderDataRange";
import OrderEdit from "../../../components/Admin/Order/OrderEdit";
import OrderDelete from "../../../components/Admin/Order/OrderDel";
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import { addDays } from "date-fns";

const EmployeeOrderHistory = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(), // Set endDate to the same as startDate initially
      key: "selection",
    },
  ]);
  const [isDateAvailable, setIsDateAvailable] = useState(false);

  // Fetch orders data
  useEffect(() => {
    fetch("https://johannas-grille.onrender.com/api/orders")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => (a.date > b.date ? -1 : 1));
        setOrders(sortedData);
        setFilteredOrders(sortedData);
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, []);

  // Filter orders based on date range
  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset pagination
  }, [dateRange, orders]);

  const displayedOrders = isDateAvailable
    ? filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : orders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(
    (isDateAvailable ? filteredOrders.length : orders.length) / rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <h1>Orders Page</h1>
        <section className="or-content-area-table">
          <OrderDataRange
            dateRange={dateRange}
            setDateRange={setDateRange}
            setIsDateAvailable={setIsDateAvailable}
          />

          <OrderHistory orders={displayedOrders} handleEdit={setSelectedOrder} handleDelete={setSelectedOrder} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="order-his-pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="order-his-pagination-button"
              >
                Previous
              </button>
              <span className="order-his-pagination-text">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="order-his-pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {isEditModalOpen && <OrderEdit selectedOrder={selectedOrder} handleCloseModal={() => setIsEditModalOpen(false)} />}
        {isDeleteModalOpen && <OrderDelete selectedOrder={selectedOrder} handleCloseModal={() => setIsDeleteModalOpen(false)} />}
      </div>
    </main>
  );
};

export default EmployeeOrderHistory;
