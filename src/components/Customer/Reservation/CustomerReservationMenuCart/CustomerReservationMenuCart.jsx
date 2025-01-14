import React from 'react';
import './CustomerReservationMenuCart.css';

const CustomerReservationMenuCart = ({ cart, handleFinalSubmit, handleIncreaseQuantity, handleDecreaseQuantity, handleRemoveItem }) => {
    return (
        <div className="cust-reserve-menu-cart">
            <h3 className="cust-reserve-menu-cart-header">Your Cart</h3>
            {cart.length > 0 ? (
                <div className="cust-reserve-menu-cart-items">
                    {cart.map((item, index) => (
                        <div key={index} className="cust-reserve-menu-cart-item">
                            <div className="cart-item-header">
                                <h4>{item.menu}</h4>
                                <button
                                    className="cart-item-remove-button"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    Remove
                                </button>
                            </div>
                            <h4>Package Price: {parseFloat(item.packagePrice * item.quantity).toFixed(2)}</h4>
                            <div className="cart-item-quantity">
                                <h4>Quantity:</h4>
                                <button
                                    className="cart-item-quantity-button"
                                    onClick={() => handleDecreaseQuantity(index)}
                                    disabled={item.quantity === 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="cart-item-quantity-button"
                                    onClick={() => handleIncreaseQuantity(index)}
                                >
                                    +
                                </button>
                            </div>
                            <div>
                                <h5>Main Dishes:</h5>
                                <ul>
                                    {item.mainDishes.map((dish, i) => (
                                        <li key={i}>
                                            {dish.itemName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5>Side Dishes:</h5>
                                <ul>
                                    {item.sideDishes.map((side, i) => (
                                        <li key={i}>
                                            {side.sideCategory}: {side.itemName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
