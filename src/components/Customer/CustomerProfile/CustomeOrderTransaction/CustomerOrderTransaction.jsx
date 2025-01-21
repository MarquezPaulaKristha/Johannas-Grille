import React, { useEffect, useState } from 'react';
import './CustomerOrderTransaction.css';
import axios from 'axios';
import { useProvider } from '../../../../global_variable/Provider';

const CustomerOrderTransaction = () => {
  const { customer } = useProvider();
  const [transactions, setTransactions] = useState([]);

  const fetchTransaction = async () => {
    if (!customer?.customerid) {
      alert('Sign in first!');
      return;
    }

    try {
      const result = await axios.get(`https://johannas-grille.onrender.com/api/customer/transaction-details/${customer.customerid}`);
      if (result.status === 200) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div className="customer-transaction" id="orders">
      <h1 className="transaction-header">Order Transactions</h1>
      <div className="transaction-cards-container">
        {transactions.map((transaction, index) => (
          <div className="transaction-card" key={index}>
            <div className="transaction-card-header">
              <h2>Order No: {transaction.orderid}</h2>
            </div>
            <div className="transaction-card-content">
              <p><strong>Menu Name:</strong> {transaction.name}</p>
              <p><strong>Quantity:</strong> {transaction.quantity}</p>
              <p><strong>Total Amount:</strong> ₱{transaction.totalamount}</p>
              <p><strong>Order Type:</strong> {transaction.orderType}</p>
              {/* <img 
                src={transaction.image_url || 'default-image.png'} 
                alt={transaction.menuName} 
                width="100" 
                height="100" 
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrderTransaction;
