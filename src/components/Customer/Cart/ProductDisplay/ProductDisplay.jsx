import React, { useState, useEffect } from 'react';
import './ProductDisplay.css';
import ProductCard from '../ProductCard/ProductCard';
import { useProvider } from '../../../../global_variable/provider';

const ProductDisplay = ({ category, orderId }) => {
  const { selectedBranch } = useProvider();
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menuitems'); // Adjust the port accordingly
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter out items where the quantity is zero or less
        const filteredData = data.filter(item => item.quantity > 0 && item.branch === selectedBranch);
        setFoodList(filteredData);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchData();
  }, [selectedBranch]);   

  return (
    <div className='food-display' id='food-display'>
      <h2>Menu</h2>
      <div className="food-display-list">
        {foodList.map((item) => {
          // Check if the item category matches
          if (category === "All" || category === item.category) {
            return (
              <ProductCard 
                key={item.inventoryid} // Use a unique key
                orderId={orderId}
                id={item.menuitemid} 
                name={item.name} 
                image={`http://localhost:3000${item.image_url}`} // Use the correct field for the image URL
                price={item.price}
              />
            );
          }
          return null; // Return null if the category does not match
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
