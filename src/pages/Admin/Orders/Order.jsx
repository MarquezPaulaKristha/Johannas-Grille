import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import OrderTable from "../../../components/Admin/Order/OrderTable";
import OrderEdit from "../../../components/Admin/Order/OrderEdit";
import OrderDelete from "../../../components/Admin/Order/OrderDel";
import "./Order.css";

const Orders = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  // Fetch orders data
  const fetchOrders = () => {
    fetch("http://localhost:3000/api/orders")
      .then((response) => response.json())
      .then((data) => {
        // Sort orders by descending order (assumes orders have a date or ID for sorting)
        const sortedData = data.sort((a, b) => (a.date > b.date ? -1 : 1));
        setOrders(sortedData);
      })
      .catch((error) => console.error("Error fetching order data:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Get paginated orders
  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDelete = (orderId) => {
    setSelectedOrder(orderId);
    setIsDeleteModalOpen(true);
  };

  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <div>
          <h1>Orders Page</h1>
          <section className="or-content-area-table">
            <div className="or-data-table-info">
              <h1 className="or-data-table-title">Latest Orders</h1>
            </div>
            <OrderTable
              orders={paginatedOrders}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </section>
        </div>

        {isEditModalOpen && (
          <OrderEdit
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            handleFormSubmit={() => console.log("Order updated")}
            handleCloseModal={() => setIsEditModalOpen(false)}
          />
        )}

        {isDeleteModalOpen && (
          <OrderDelete
            selectedOrder={selectedOrder}
            handleCloseModal={() => setIsDeleteModalOpen(false)}
            handleDeleteOrder={(orderId) => console.log("Order deleted:", orderId)}
          />
        )}
      </div>
    </main>
  );
};

export default Orders;
