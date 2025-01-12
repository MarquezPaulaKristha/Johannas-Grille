import React from 'react';
import './CustomerReservationMenuCart.css'

const CustomerReservationMenuCart = ({ cart, handleFinalSubmit }) => {
    return (
        <div className="cust-reserve-menu-cart">
            <h3 className="cust-reserve-menu-cart-header">Your Cart</h3>
            {cart.length > 0 ? (
                <div className="cust-reserve-menu-cart-items">
                    {cart.map((item, index) => (
                        <div key={index} className="cust-reserve-menu-cart-item">
                            <span>{item.itemName}</span>
                            <span>{item.price}</span>
                            <span>{item.quantity}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="cust-reserve-menu-empty-cart">Your cart is empty</p>
            )}
            <button
                className="cust-reserve-menu-confirm-button"
                onClick={handleFinalSubmit}
                disabled={cart.length === 0}
            >
                Confirm Selection
            </button>
        </div>
    );
};

export default CustomerReservationMenuCart;
