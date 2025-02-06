import React, { useState, useEffect } from 'react';
import './ItemDisplay.css';
import Item from '../Item/Item';
import { useProvider } from '../../../../global_variable/Provider';

const ItemDisplay = ({ category, items, orderId }) => {
  const { foodList, setFoodList, selectedEmployeeBranch } = useProvider();

  const fetchData = async () => {
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/menuitems');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredData = data.filter(item => item.quantity > 0 && item.branch === selectedEmployeeBranch);
      setFoodList(filteredData);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEmployeeBranch]);

  return (
    <div className="em-order-item-food-display" id="food-display">
      <div className="em-order-item-food-display-list">
        {foodList.map((item) => {
          // Check if the item category matches
          if (category === "All" || category === item.category) {
            return (
              <Item
                key={item.menuitemid} // Use a unique key
                orderId={orderId}  // Pass the orderId properly
                id={item.menuitemid}  // Pass the base item ID
                name={item.name}
                price={item.price}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ItemDisplay;
