import React, { useState } from "react";
import axios from "axios";
import { useProvider } from "../../../../global_variable/Provider";

const GCashOrderPopup = ({ onCancel, branch }) => {
    const { orderItems, setOrderItems, customername, setcustomername, orderType, setOrderType, selectedEmployeeBranch } = useProvider();
    const [receivedAmount, setReceivedAmount] = useState("");
    const activeBranch = branch || selectedEmployeeBranch;

    const totalPrice = orderItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
        0
    );

    const change = receivedAmount ? Math.max(0, receivedAmount - totalPrice) : 0;

    const handleReceivedAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        setReceivedAmount(isNaN(value) ? "" : value);
    };

    const handleConfirmPayment = async () => {
        if (!customername) {
            alert("Please enter a name.");
            return;
        }
    
        if (orderItems.length === 0) {
            alert("No items in the order.");
            return;
        }
    
        if (receivedAmount < totalPrice) {
            alert("Received amount is less than the total price.");
            return;
        }
    
        const lineItems = orderItems.map((item) => ({
            quantity: item.quantity,
            name: item.name,
            price: item.price,
        }));
    
        try {
            const response = await axios.post(
                "https://johannas-grille.onrender.com/api/gcash-checkout",
                { lineItems } // Send the correct payload
            );
    
            if (response.status === 200) {
                const { url } = response.data;
                window.location.href = url; // Redirect to GCash payment page
            }
        } catch (error) {
            console.error("Failed to initiate GCash payment:", error.response?.data || error.message);
            alert("Failed to initiate GCash payment. Please try again.");
        }
    };

    return (
        <div className="place-order-popup">
            <div className="place-order-popup-inner">
                <h2>Confirm Your Order</h2>
                <ul className="order-items-list">
                    {orderItems.map((item) => (
                        <li key={item.menuitemid}>
                            <div className="orderitems">
                                <div className="orderitem-info">
                                    <h4>{item.quantity}x</h4>
                                    <h4>{item.name}</h4>
                                </div>
                                <div className="orderitem-price">
                                    <p>Price: P{Number(item.price) ? Number(item.price).toFixed(2) : "N/A"}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <p>Order Type: <strong>{orderType}</strong></p>
                <p>Total Items: <strong>{orderItems.length}</strong></p>
                <p>Total Price: <strong>P{totalPrice.toFixed(2)}</strong></p>
                <p>Change: <strong>P{change.toFixed(2)}</strong></p>
                <div className="emp-table-number">
                    <label>
                        Name:
                        <input
                            type="text"
                            value={customername}
                            onChange={(e) => setcustomername(e.target.value)}
                            placeholder="Enter name"
                        />
                    </label>
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
                </div>
                <div className="place-order-buttons">
                    <button
                        className="confirm-button"
                        onClick={handleConfirmPayment}
                        disabled={receivedAmount < totalPrice || orderItems.length === 0}
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