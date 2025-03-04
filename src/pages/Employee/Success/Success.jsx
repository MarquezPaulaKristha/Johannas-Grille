import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/Provider";

function SuccessPage() {
  const {
    orderItems,
    setOrderItems,
    customername,
    setcustomername,
    orderType,
    setOrderType,
    branch,
    selectedEmployeeBranch,
    setBranch,
  } = useProvider();
  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  // Retrieve branch from sessionStorage
  const storedBranch = sessionStorage.getItem("employee_branch");
  const parsedBranch = storedBranch ? JSON.parse(storedBranch) : null;

  // Update branch state when necessary
  useEffect(() => {
    if (!branch && parsedBranch) {
      setBranch(parsedBranch);
    }
  }, [branch, parsedBranch, setBranch]);

  // Calculate total price
  const totalPrice = orderItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      currentDate: now.toISOString().split("T")[0],
      currentTime: now.toTimeString().split(" ")[0],
    };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    // Prepare order data
    const orderData = {
      customerid: "0000",
      orderItems: orderItems.map((item) => ({
        orderid: item.orderid,
        menuitemid: item.menuitemid,
        order_quantity: item.quantity,
      })),
      totalamount: totalPrice,
      ordertype: orderType,
      date: currentDate,
      time: currentTime,
      customername: customername,
      status: "Pending",
      selectedBranch: parsedBranch, // Using the corrected activeBranch
    };

    console.log("Order Data:", orderData); // Debugging

    try {
      // Send order data to the backend
      const response = await axios.post(
        "https://johannas-grille.onrender.com/api/create-order",
        orderData
      );
      console.log("Backend Response:", response.data); // Debugging

      setOrderItems([]); // Clear order items
      setcustomername(""); // Reset customer name
      setOrderType("Dine In"); // Reset order type
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      alert("Failed to create order. Please try again.");
    }
  };

  // Call handleConfirmPayment on component mount
  useEffect(() => {
    handleConfirmPayment();
  }, []);

  // Navigate back to the order page
  const handleShopping = () => {
    navigate("/employee/order");
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <div className="success-icon">₱</div>
        <h1 className="mt-3">Payment Successful</h1>
        <p className="payment-message">Thank you for your payment!</p>
        <button className="success-button" onClick={handleShopping}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
