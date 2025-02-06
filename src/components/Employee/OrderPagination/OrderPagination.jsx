import React from "react";
import "./OrderPagination.css"; // Import the CSS file

const OrderPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="order-pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="order-pagination-button"
      >
        Previous
      </button>
      <span className="order-pagination-text">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="order-pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default OrderPagination;
