// import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../../components";
import React, { useState, useEffect } from 'react'
import ItemDisplay from "../../../components/Admin/Product/ItemDisplay/ItemDisplay";
import Menu from "../../../components/Admin/Product/MenuFunction/AdminAddProduct";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import './Product.css'

const Product = () => {
    const [category, setCategory] = useState('All');
    const [items, setItems] = useState([]);
  
    // Fetch the items from the backend
    const fetchItems = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/menuitems');
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
            {/* left of page */}
            <Sidebar />
            {/* right side/content of the page */}
            <div className="content-wrapper">
                <Menu category={category} setCategory={setCategory} refreshItems={fetchItems} />
                <ItemDisplay category={category} items={items}/>
                {/* <AreaCharts />
        <AreaTable /> */}
            </div>
        </main>
    );
};

export default Product;
