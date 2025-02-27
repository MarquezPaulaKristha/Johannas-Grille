import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderItem from "../OrderItem/OrderItem";
import "./OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://johannas-grille.onrender.com/api/employee-orders"
        );
        console.log("Fetched orders:", response.data);
  
        // Ensure response.data is an array before updating state
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("Invalid API response format:", response.data);
          setOrders([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const groupedOrders = {
    "Dine In": orders.filter((order) => order.ordertype === "Dine In"),
    "Take Out": orders.filter((order) => order.ordertype === "Take Out"),
    Pickup: orders.filter((order) => order.ordertype === "Pickup"),
  };

  return (
    <div className="em-container">
      <div className="em-columns">
        {["Dine In", "Take Out", "Pickup"].map((orderType) => (
          <div key={orderType} className="em-column">
            <h2>{orderType} Orders</h2>
            <div className="em-orders">
              {groupedOrders[orderType].length > 0 ? (
                groupedOrders[orderType].map((order) => (
                  <OrderItem
                    key={order.orderid}
                    orderid={order.orderid}
                    customerName={order.customer_name} // Pass customer name
                    items={order.items}
                    curdate={order.date}
                  />
                ))
              ) : (
                <p>No {orderType.toLowerCase()} orders available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
