import React from 'react';
import './OrderItem.css'; // Import the CSS file
import { useProvider } from '../../../global_variable/provider';

function OrderItem({ item, increaseQuantity, decreaseQuantity }) {
  const { orderItems, setOrderItems } = useProvider();

  const removeItem = (product) => {
    // Filter out the product to be removed from orderItems
    const newOrderItems = orderItems.filter(orderItem => orderItem.menuitemid !== product.menuitemid);
    setOrderItems(newOrderItems); // Update the orderItems state
  };

  return (
    <div className="emp-order-item">
      <img src={item.image_url} alt={item.name} className="emp-item-image" />
      <div className="emp-item-details">
        <div className="emp-info">
          <span className="emp-item-name">{item.name}</span>
          <span className="emp-item-price">₱{item.price}</span>
        </div>
        <div className="emp-item-controls">
          <div className="emp-quantity-controls">
            <button onClick={decreaseQuantity}>-</button>
            <span>{item.quantity}</span>
            <button onClick={increaseQuantity}>+</button>
            <button onClick={() => removeItem(item)}>x</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
