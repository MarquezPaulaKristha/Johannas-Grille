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
        const response = await axios.get('https://johannas-grille.onrender.com/api/menuitems');

        if (response.status === 200) {
          const data = response.data;

          // Filter food items based on selected branch
          const filteredData = data.filter(item =>
            item.quantity > 0 && (selectedBranch === '' || item.branch === selectedBranch)
          );

          setFoodList(filteredData);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchData();
  }, [selectedBranch]); // Re-run effect when branch selection changes

  return (
    <div className='food-display' id='food-display'>
      <h2>Menu</h2>
      <div className="food-display-list">
        {foodList.map((item) => (
          (category === "All" || category === item.category) && (
            <ProductCard
              key={item.menuitemid}
              orderId={orderId}
              id={item.menuitemid}
              name={item.name}
              image={`https://johannas-grille.onrender.com${item.image_url}`}
              price={item.price}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;
