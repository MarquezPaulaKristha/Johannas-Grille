import React, { useState } from 'react';
import axios from 'axios';
import { useProvider } from '../../../../global_variable/provider';

const GCashOrderPopup = ({ orderItems, orderType, onCancel, onConfirm }) => {
    const { tableNumber, setTableNumber } = useProvider()
    const totalPrice = orderItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
        0
    );

    const handleConfirmPayment = async () => {
        const body = {
            lineItems: orderItems.map(item => ({
                quantity: item.quantity,
                name: item.name,
                price: item.price
            })),
        };

        try {
            const response = await axios.post('http://localhost:3000/api/gcash-checkout', body);

            const { url } = response.data;

            window.location.href = url;
        } catch (error) {
            console.error('Error initiating payment:', error);
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
                <div className="place-order-buttons">
                    <button
                        className="confirm-button"
                        onClick={handleConfirmPayment}
                        disabled={!tableNumber}
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

export default GCashOrderPopup;
