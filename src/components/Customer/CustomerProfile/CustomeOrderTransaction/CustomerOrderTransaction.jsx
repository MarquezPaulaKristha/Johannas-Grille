import React from 'react';
import './CustomerOrderTransaction.css';

const CustomerOrderTransaction = () => {
  const transactions = [
    {
      orderno: '001',
      menuName: 'Cheeseburger',
      qty: 2,
      totalAmount: 300,
      orderType: 'Dine-In',
      // image_url: 'cheeseburger.png', // Make sure this property exists
    },
    {
      orderno: '002',
      menuName: 'Spaghetti',
      qty: 1,
      totalAmount: 150,
      orderType: 'Take-Out',
      // image_url: 'spaghetti.png', // Ensure this property exists
    },
    {
      orderno: '003',
      menuName: 'Pizza',
      qty: 3,
      totalAmount: 900,
      orderType: 'Delivery',
      // image_url: 'pizza.png', // Ensure this property exists
    },
  ];

  return (
    <div className="customer-transaction" id="orders">
      <h1 className="transaction-header">Order Transactions</h1>
      <div className="transaction-cards-container">
        {transactions.map((transaction, index) => (
          <div className="transaction-card" key={index}>
            <div className="transaction-card-header">
              <h2>Order No: {transaction.orderno}</h2>
            </div>
            <div className="transaction-card-content">
              <p><strong>Menu Name:</strong> {transaction.menuName}</p>
              <p><strong>Quantity:</strong> {transaction.qty}</p>
              <p><strong>Total Amount:</strong> ₱{transaction.totalAmount.toFixed(2)}</p>
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
