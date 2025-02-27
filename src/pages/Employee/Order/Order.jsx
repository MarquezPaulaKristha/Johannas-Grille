import React, { useState } from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import ExploreMenu from '../../../components/Employee/Order/MenuCategory/MenuCategory';
import ItemDisplay from '../../../components/Employee/Order/ItemDisplay/ItemDisplay';
import OrderCart from '../../../components/Employee/Order/OrderCart/OrderCart';
import { useProvider } from '../../../global_variable/Provider';
import './Order.css';

const generateOrderId = () => {
  return Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number
};

const EmployeeOrder = () => {
  const [category, setCategory] = useState("All");
  const [orderId, setOrderId] = useState(generateOrderId());
  const { branch } = useProvider(); 

  const createNewOrder = () => {
    setOrderId(generateOrderId());
  };

  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header/>
        <OrderCart 
          category={category} 
          setCategory={setCategory} 
          orderId={orderId}
          branch={branch}
        />
        <ExploreMenu category={category} setCategory={setCategory} />
        <ItemDisplay category={category} orderId={orderId} />
      </div>
    </div>
  );
};

export default EmployeeOrder;
