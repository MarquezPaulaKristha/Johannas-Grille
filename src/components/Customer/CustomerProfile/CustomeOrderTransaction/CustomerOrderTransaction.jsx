import React, { useEffect, useState } from 'react';
import './CustomerOrderTransaction.css';
import axios from 'axios';
import { useProvider } from '../../../../global_variable/Provider';

const CustomerOrderTransaction = () => {
  const { customer } = useProvider();
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from the backend
  const fetchTransaction = async () => {
    if (!customer?.customerid) {
      alert('Sign in first!');
      return;
    }

    try {
      const result = await axios.get(
        `https://johannas-grille.onrender.com/api/customer/transaction-details/${customer.customerid}`
      );
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

  // Group transactions by orderid
  const groupTransactionsByOrderId = (transactions) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const { orderid, name, quantity, totalamount, ordertype } = transaction;
      if (!acc[orderid]) {
        acc[orderid] = {
          orderid,
          ordertype,
          items: [],
          totalAmount: totalamount,
        };
      }

      acc[orderid].items.push({ name, quantity });

      return acc;
    }, {});

    return Object.values(grouped); // Convert object back to array
  };

  const groupedTransactions = groupTransactionsByOrderId(transactions);

  return (
    <div className="customer-transaction" id="orders">
      <h1 className="transaction-header">Order Transactions</h1>
      <div className="transaction-cards-container">
        {groupedTransactions.map((transaction) => (
          <div className="transaction-card" key={transaction.orderid}>
            <div className="transaction-card-header">
              <h2>Order No: {transaction.orderid.slice(-5)}</h2>
            </div>
            <div className="transaction-card-content">
              <h3>Items:</h3>
              <ul>
                {transaction.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total Amount:</strong> ₱{transaction.totalAmount}
              </p>
              <p>
                <strong>Order Type:</strong> {transaction.ordertype}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrderTransaction;
