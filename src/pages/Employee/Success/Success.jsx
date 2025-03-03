import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/Provider";

function SuccessPage() {
  const {orderItems, setOrderItems, customername, setcustomername, orderType, setOrderType, branch, selectedEmployeeBranch} = useProvider();

  console.log("Branch in SuccessPage:", branch); // Debugging
  console.log("Selected Employee Branch in SuccessPage:", selectedEmployeeBranch); // Debugging

  const navigate = useNavigate();
  const hasCalledPayment = useRef(false);

  const totalPrice = orderItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0]; // HH:mm:ss
    return { currentDate, currentTime };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

    const activeBranch = branch || selectedEmployeeBranch || "DefaultBranch"; // Fallback logic

    console.log("Active Branch in handleConfirmPayment:", activeBranch); // Debugging

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
      selectedBranch: activeBranch, // Use activeBranch
    };

    console.log("Order data to be sent:", orderData); // Debugging

    try {
      const response = await axios.post(
        "https://johannas-grille.onrender.com/api/create-order",
        orderData
      );
      console.log("Create order response:", response.data); // Debugging

      if (response.status === 200) {
        setOrderItems([]);
        setcustomername("");
        setOrderType("Dine In");
      }
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    handleConfirmPayment();
  }, []);

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