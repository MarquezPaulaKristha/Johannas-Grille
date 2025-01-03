import React, { useState, useEffect } from 'react'
import InventoryFetch from '../../../components/Admin/Inventory/InventoryFetch/InventoryFetch';
import InventoryCategory from '../../../components/Admin/Inventory/InventoryFunction/InventoryCategory';
import Sidebar from '../../../components/Admin/Sidebar/Sidebar'
import './Inventory.css'

const Inventory = () => {
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState([]);

  // Fetch the items from the backend
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menuitems');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data); // Update items state
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchItems(); // Fetch items when component mounts
  }, []);

  return (
    <main >
      <Sidebar />
      <div className="content-wrapper">
        <InventoryCategory category={category} setCategory={setCategory} refreshItems={fetchItems} />
        <InventoryFetch category={category} items={items} />
      </div>
    </main>
  );
};

export default Inventory;
