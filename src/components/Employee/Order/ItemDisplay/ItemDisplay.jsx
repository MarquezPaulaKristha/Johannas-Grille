import React, { useState, useEffect } from 'react';
import './ItemDisplay.css';
import Item from '../Item/Item';
import { useProvider } from '../../../../global_variable/provider';

const ItemDisplay = ({ category, items, orderId }) => {
  const { foodList, setFoodList, selectedEmployeeBranch, setSelectedEmployeeBranch }  = useProvider();

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menuitems');
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


  // Group items by base name and create variants with unique IDs
  const groupedItems = React.useMemo(() => {
    const groups = new Map();

    foodList.forEach(item => {
      const match = item.name.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        const baseName = match[1].trim();
        const variant = match[2].trim();
        const variantId = `${item.menuitemid}-${variant}`;  // Create a unique ID for the variant

        if (!groups.has(baseName)) {
          groups.set(baseName, { ...item, name: baseName, variants: [] });
        }
        groups.get(baseName).variants.push({ variant, id: variantId });  // Include the variant's unique ID
      } else {
        groups.set(item.name, { ...item, variants: [{ variant: 'Regular', id: item.menuitemid }] });
      }
    });

    return Array.from(groups.values());
  }, [foodList]);

  return (
    <div className="em-order-item-food-display" id="food-display">
      <div className="em-order-item-food-display-list">
        {groupedItems.map((item) => {
          // Check if the item category matches
          if (category === "All" || category === item.category) {
            return (
              <Item
                key={item.menuitemid} // Use a unique key
                orderId={orderId}  // Pass the orderId properly
                id={item.menuitemid}  // Pass the base item ID
                name={item.name}
                price={item.price}
                image={`http://localhost:3000${item.image_url}`} // Use the correct field for the image URL
                variants={item.variants} // Pass the variants to the Item component
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
