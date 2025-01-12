import React, { useEffect, useState } from 'react';
import './AdminReservationMenuFetch.css';
import AdminReservationMenuList from '../AdminReservationMenuList/AdminReservationMenuList';

const AdminReservationMenuFetch = ({ category }) => {
  const [foodList, setFoodList] = useState([]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/reservationmenuitems');
      if (response.ok) {
        const data = await response.json();
        setFoodList(data);
        console.log('Fetched data:', data);
      } else {
        console.error('Error fetching menu items:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="admin-res-item-food-display" id="food-display">
      <div className="admin-res-item-food-display-list">
        {foodList.map((item) => {
          if (category === 'All' || category === item.category) {
            return (
              <AdminReservationMenuList
                key={item.menuitemid}
                id={item.menuitemid}
                name={item.item_name}
                price={item.package_price}
                image={`https://johannas-grille.onrender.com${item.image_url}`}
              />
            );
          }
          return null; // Skip items that don't match the category
        })}
      </div>
    </div>
  );
};

export default AdminReservationMenuFetch;
