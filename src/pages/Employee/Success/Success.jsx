import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./success.css";
import { useProvider } from "../../../global_variable/Provider";

function SuccessPage() {
  const { orderItems, setOrderItems, customername, setcustomername, orderType, setOrderType, branch, setBranch } = useProvider();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCalledPayment = useRef(false);

  useEffect(() => {
    if (location.state?.branch) {
      console.log("Setting branch from location.state:", location.state.branch);
      setBranch(location.state.branch);
    }
  }, [location.state?.branch, setBranch]);

  const activeBranch = location.state?.branch || branch;
  console.log("Branch in SuccessPage:", activeBranch);

  const totalPrice = orderItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      currentDate: now.toISOString().split("T")[0],
      currentTime: now.toTimeString().split(" ")[0],
    };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const handleConfirmPayment = async () => {
    if (hasCalledPayment.current) return;
    hasCalledPayment.current = true;

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
      selectedBranch: activeBranch,
    };

    try {
      await axios.post("https://johannas-grille.onrender.com/api/create-order", orderData);
      setOrderItems([]);
      setcustomername("");
      setOrderType("Dine In");
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
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
