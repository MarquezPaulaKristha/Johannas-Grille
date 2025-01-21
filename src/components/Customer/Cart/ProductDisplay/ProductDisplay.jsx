import React, { useState, useEffect } from 'react';
import './ProductDisplay.css';
import ProductCard from '../ProductCard/ProductCard';
import { useProvider } from '../../../../global_variable/Provider';
import axios from "axios";

const ProductDisplay = ({ category, orderId }) => {
  const { selectedBranch } = useProvider();
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://johannasgrille.onrender.com/api/menuitems');
  
        if (response.status === 200) {
          const data = response.data; // Inspect the data structure
          console.log('API response data:', data);
  
          if (Array.isArray(data)) {
            const filteredData = data.filter(
              item => item.quantity > 0 && item.branch === selectedBranch
            );
            setFoodList(filteredData);
          } else {
            console.error('Unexpected data format:', data);
          }
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
                image={`https://johannasgrille.onrender.com${item.image_url}`} // Use the correct field for the image URL
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
