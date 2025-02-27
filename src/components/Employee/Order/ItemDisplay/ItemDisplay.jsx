import React, { useEffect } from 'react';
import './ItemDisplay.css';
import Item from '../Item/Item';
import { useProvider } from '../../../../global_variable/Provider';

const ItemDisplay = ({ category, orderId }) => {
  const { foodList, setFoodList, branch } = useProvider(); // ✅ Use 'branch', not 'setBranch'

  useEffect(() => {
    console.log("Current selected branch:", branch); // ✅ Debugging log

    const fetchData = async () => {
      if (!branch) {
        console.warn("Branch not set, skipping fetch.");
        return;
      }

      try {
        console.log("Fetching menu for branch:", branch);
        const response = await fetch(`https://johannas-grille.onrender.com/api/menuitems`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched menu items:", data);

        // ✅ Use 'branch', not 'setBranch'
        const filteredData = data.filter(item => {
          console.log(`Item Branch: ${item.branch}, Selected: ${branch}`);
          return item.quantity > 0 && item.branch?.toLowerCase() === branch.toLowerCase();
        });

        console.log("Filtered menu items:", filteredData);
        setFoodList(filteredData);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchData();
  }, [branch]); // ✅ Depend on 'branch', not 'setBranch'

  return (
    <div className="em-order-item-food-display" id="food-display">
      <div className="em-order-item-food-display-list">
        {foodList.length > 0 ? (
          foodList.map(item => (
            (category === "All" || category === item.category) && (
              <Item key={item.menuitemid} orderId={orderId} id={item.menuitemid} name={item.name} price={item.price} />
            )
          ))
        ) : (
          <p>No items available for this branch.</p>
        )}
      </div>
    </div>
  );
};

export default ItemDisplay;

