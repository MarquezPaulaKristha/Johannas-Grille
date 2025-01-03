import React, { useState, useEffect } from "react";
import AreaTop from "../../../components/Admin/Dashboard/AreaTop/AreaTop";
import AreaCards from "../../../components/Admin/Dashboard/AreaCards/AreaCards";
import AreaCharts from "../../../components/Admin/Dashboard/AreaCharts/AreaCharts";
import OrderTable from "../../../components/Admin/Order/OrderTable";
import Header from "../../../components/Admin/Header/Header";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("http://localhost:3000/api/orders")
      .then((response) => response.json())
      .then((data) => {
        // Sort orders by descending order (assuming the date is for ordering)
        const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Slice the first 10 orders
        setOrders(sortedOrders.slice(0, 10));
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main>
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <Header />
        <AreaTop />
        <AreaCards />
        <AreaCharts />
        <OrderTable orders={orders} />
      </div>
    </main>
  );
};

export default Dashboard;
