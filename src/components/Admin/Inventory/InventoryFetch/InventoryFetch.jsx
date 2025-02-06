import React, { useState, useEffect } from 'react';
import './InventoryFetch.css';
import InventoryCard from '../InventoryCard/InventoryCard';

const InventoryFetch = ({ category }) => {
  const [foodList, setFoodList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('Bauan'); // Default to Bauan

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/inventory');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleBranchFilter = (branch) => {
    setSelectedBranch(branch);
  };

  return (
    <div className='inv-item-food-display' id='food-display'>
      <div className="inv-branch-filter">
        <button
          className={`inv-filter-button ${selectedBranch === 'Bauan' ? 'active' : ''}`}
          onClick={() => handleBranchFilter('Bauan')}
        >
          Bauan
        </button>
        <button
          className={`inv-filter-button ${selectedBranch === 'Batangas' ? 'active' : ''}`}
          onClick={() => handleBranchFilter('Batangas')}
        >
          Batangas
        </button>
      </div>

      <div className="inv-item-food-display-list">
        {foodList
          .filter((item) => 
            (category === 'All' || category === item.category) &&
            (selectedBranch === 'All' || item.branch.toLowerCase() === selectedBranch.toLowerCase())
          )
          .map((item) => (
            <InventoryCard
              key={`${item.menuitemid}-${item.branch}`}
              id={item.menuitemid}
              name={item.name}
              price={item.price}
              category={item.category}
              quantity={item.quantity}
              image={item.image_url}
              invid={item.inventoryid}
              branch={item.branch}
            />
          ))}
      </div>
    </div>
  );
};

export default InventoryFetch;
