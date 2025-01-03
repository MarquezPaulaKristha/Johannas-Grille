import React, { useState } from 'react';
import axios from "axios";
import './PlaceOrderPopup.css';
import { useProvider } from '../../../../global_variable/provider';

const PlaceOrderPopup = ({ onCancel, onConfirm }) => {
    const { orderItems, setOrderItems, tableNumber, setTableNumber, orderType, setOrderType } = useProvider();
    const [receivedAmount, setReceivedAmount] = useState('');
    const totalPrice = orderItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
        0
    );
    const change = receivedAmount ? Math.max(0, receivedAmount - totalPrice) : 0;

    const handleReceivedAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        setReceivedAmount(isNaN(value) ? '' : value);
    };

    const getCurrentDateTime = () => {
        const now = new Date();
    
        // Format the date as YYYY-MM-DD
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const currentTime = now.toTimeString().split(" ")[0]; // HH:mm:ss
    
        return { currentDate, currentTime };
    };
    
    const { currentDate, currentTime } = getCurrentDateTime();

    const handleConfirmPayment = async () => {
        if (!tableNumber) {
            alert("Please enter a table number.");
            return;
        }

        const orderData = {
          customerid: "0000",
          orderItems: orderItems.map(item => ({
            orderid: item.orderid,
            menuitemid: item.menuitemid,
            order_quantity: item.quantity,
          })),
          totalamount: totalPrice,
          ordertype: orderType,
          date: currentDate,
          time: currentTime,
          tableno: tableNumber,
          status: "Pending",
        };
    
        try {
          const response = await axios.post("http://localhost:3000/api/create-order", orderData);
          if (response.status === 200) {
            setOrderItems([]);
            setTableNumber("");
            setOrderType("Dine In");
            window.location.reload();
            onCancel();
          }
        } catch (error) {
          alert("Failed to create order. Please try again.");
        }
      };

    return (
        <div className="place-order-popup">
            <div className="place-order-popup-inner">
                <h2>Confirm Your Order</h2>
                <ul className="order-items-list">
                    {orderItems.map((item) => (
                        <li key={item.menuitemid}>
                            {item.name} - Quantity: {item.quantity} - 
                            Price: ${Number(item.price) ? Number(item.price).toFixed(2) : 'N/A'}
                        </li>
                    ))}
                </ul>
                <p>Order Type: <strong>{orderType}</strong></p>
                <p>Total Items: <strong>{orderItems.length}</strong></p>
                <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                <div className="emp-table-number">
                    <label>
                        Table No.
                        <input 
                            type="number" 
                            value={tableNumber}  // Bind input value to state
                            onChange={(e) => setTableNumber(e.target.value)}  // Update state on input change
                        />
                    </label>
                </div>
                <div className="payment-section">
                    <label>
                        Amount Received:
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={receivedAmount}
                            onChange={handleReceivedAmountChange}
                            placeholder="Enter amount"
                        />
                    </label>
                    <p>Change: <strong>${change.toFixed(2)}</strong></p>
                </div>
                <div className="place-order-buttons">
                    <button
                        className="confirm-button"
                        onClick={handleConfirmPayment}
                        disabled={receivedAmount < totalPrice || (receivedAmount === '' && !tableNumber)}
                    >
                        Confirm Order
                    </button>
                    <button className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPopup;
