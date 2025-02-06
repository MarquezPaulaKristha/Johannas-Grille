import React from 'react';
import './Item.css';
import { useProvider } from '../../../../global_variable/Provider';

const FoodItem = ({ id, name, price, image, orderId }) => {
  const { orderItems, setOrderItems, foodList } = useProvider();

  const handleAddToOrder = () => {
    // Find the food item by ID
    const foodItem = foodList.find((item) => item.menuitemid === id);

    if (!foodItem) {
      console.error("Item not found in menu.");
      return;
    }

    const newOrderItem = {
      orderid: orderId,
      menuitemid: id,
      name: foodItem.name,
      quantity: 1,
      price: foodItem.price,
      totalAmount: foodItem.price
    };

    // Check if the item already exists in the order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.menuitemid === newOrderItem.menuitemid
    );

    if (existingItemIndex !== -1) {
      // Update the quantity and total amount if the item exists
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[existingItemIndex].quantity += 1;
      updatedOrderItems[existingItemIndex].totalAmount =
        updatedOrderItems[existingItemIndex].quantity * foodItem.price;

      setOrderItems(updatedOrderItems);
    } else {
      // Add new item to the order list
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  return (
    <div 
      className="emp-menu-container"
      onClick={handleAddToOrder} // Click anywhere on the card to add item
      style={{ cursor: "pointer" }}
    >
      <div className="emp-item-food-card">
        <div className="emp-item-food-card-info">
          <div className="emp-item-food-card-name-rating">
            <h3 className="emp-product-name">{name}</h3>
            <p className="emp-product-price">₱{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
