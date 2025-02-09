import React, { useEffect, useState } from 'react';
import './ItemDisplay.css';
import MenuDisplay from '../MenuDisplay/MenuDisplay';

const ItemDisplay = ({ category }) => {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/menuitems'); // Adjust the port accordingly
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchData();
  }, []);

  // Filter the foodList by category and then remove duplicate names
  const filteredFoodList = foodList.filter(item => category === "All" || category === item.category);

  // Use a Set to track unique names
  const uniqueItems = [];
  const seenNames = new Set();

  filteredFoodList.forEach(item => {
    if (!seenNames.has(item.name)) {
      seenNames.add(item.name);
      uniqueItems.push(item);
    }
  });

  return (
    <div className='item-food-display' id='food-display'>
      <div className="item-food-display-list">
        {uniqueItems.map((item) => (
          <MenuDisplay
            key={item.menuitemid} // Use a unique key
            id={item.menuitemid}
            name={item.name}
            price={item.price}
            image={`https://johannas-grille.onrender.com${item.image_url}`} // Use the correct field for the image URL
          />
        ))}
      </div>
    </div>
  );
};

export default ItemDisplay;
