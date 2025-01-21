import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import AdminReservationMenuCategory from "../../../components/Admin/Reservation/AdminReservationMenuCategory/AdminReservationMenuCategory";
import AdminReservationMenuFetch from "../../../components/Admin/Reservation/AdminReservationMenuFetch/AdminReservationMenuFetch"
import "./Reservation.css";

const ReservationMenu = () => {
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
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <AdminReservationMenuCategory category={category} setCategory={setCategory} refreshItems={fetchItems}/>
        <AdminReservationMenuFetch category={category} items={items}/>
      </div>
    </main>
  );
};

export default ReservationMenu;