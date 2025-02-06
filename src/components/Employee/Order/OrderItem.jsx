import React from 'react';
import './OrderItem.css'; // Import the CSS file
import { useProvider } from '../../../global_variable/Provider';

function OrderItem({ item, increaseQuantity, decreaseQuantity }) {
  const { orderItems, setOrderItems } = useProvider();

  const removeItem = (product) => {
    const newOrderItems = orderItems.filter(orderItem => orderItem.menuitemid !== product.menuitemid);
    setOrderItems(newOrderItems);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity === 1) {
      removeItem(item);
    } else {
      decreaseQuantity();
    }
  };

  return (
    <div className="emp-order-item">
      <div className="emp-item-details">
        <div className="emp-info">
          <span className="emp-item-name">{item.name}</span>
          <span className="emp-item-price">₱{item.price}</span>
        </div>
        <div className="emp-item-controls">
          <div className="emp-quantity-controls">
            <button onClick={handleDecreaseQuantity}>-</button>
            <span>{item.quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
