import React, { useState } from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import ExploreMenu from '../../../components/Employee/Order/MenuCategory/MenuCategory';
import ItemDisplay from '../../../components/Employee/Order/ItemDisplay/ItemDisplay';
import OrderCart from '../../../components/Employee/Order/OrderCart/OrderCart';
import './Order.css';

const generateOrderId = () => {
  return Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number (10000-99999)
};

const EmployeeOrder = () => {
  const [category, setCategory] = useState("All");
  const [orderId, setOrderId] = useState(generateOrderId()); // Initialize with a 5-digit random number

  const createNewOrder = () => {
    setOrderId(generateOrderId()); // Generate a new 5-digit random order ID
  };

  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <OrderCart category={category} setCategory={setCategory} orderId={orderId} />
        <ExploreMenu category={category} setCategory={setCategory} />
        <ItemDisplay category={category} orderId={orderId} /> {/* Pass orderId to ItemDisplay */}
      </div>
    </div>
  );
};

export default EmployeeOrder;
