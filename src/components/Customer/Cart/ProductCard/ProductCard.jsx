import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import { useProvider } from '../../../../global_variable/Provider';
import Cart from '../../../../pages/Customer/ItemPopup/ItemPopup'; // Import the Cart component

const FoodItem = ({ id, name, price, image, orderId }) => {
  const { customer, cartItems, setCartItems } = useProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false); // To control the popup visibility

  // Fetch menu items data on component mount
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/menuitems');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error('Error fetching menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="food-card">
      <div className="food-card-img-container">
        <img className="food-card-image" src={image} alt={name} loading="lazy" />
      </div>
      <div className="food-card-info">
        <div className="food-card-name-rating">
          <h4>{name}</h4>
          <p>₱{price}</p>
        </div>
        <button 
          className="btn-cart" 
          onClick={() => setShowCartPopup(true)}>Add to Cart
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Show the Cart popup if showCartPopup is true */}
      {showCartPopup && <Cart name={name} price={price} orderId={orderId} setShowCartPopup={setShowCartPopup} />}
    </div>
  );
};

export default FoodItem;
