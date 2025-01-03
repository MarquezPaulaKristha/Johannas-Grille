import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItem from '../OrderItem/OrderItem';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employee-orders'); // Axios GET request
        console.log("Fetched orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error); // Handle errors
      }
    };

    fetchOrders();
  }, []);

  // Group orders by type (Dine In, Take Out, Pickup)
  const groupedOrders = {
    'Dine In': orders.filter(order => order.ordertype === 'Dine In'),
    'Take Out': orders.filter(order => order.ordertype === 'Take Out'),
    'Pickup': orders.filter(order => order.ordertype === 'Pickup'),
  };

  return (
    <div className="em-container">
      <div className="em-columns">
        {['Dine In', 'Take Out', 'Pickup'].map(orderType => (
          <div key={orderType} className="em-column">
            <h2>{orderType} Orders</h2>
            <div className="em-orders">
              {groupedOrders[orderType].length > 0 ? (
                groupedOrders[orderType].map(order => (
                  <OrderItem
                    key={order.orderid}
                    orderid={order.orderid}
                    items={order.items} // Assuming the backend already groups items
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
