import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import { useProvider } from '../../../../global_variable/provider';

const FoodItem = ({ id, name, price, image, onAddToOrder, orderId }) => {
  const { customer, cartItems, setCartItems } = useProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const handleAddToOrder = async () => {
    if (!customer) {
      alert(`Please sign in first!`);
      return;
    }
  
    const newCartItem = {
      orderid: orderId,
      menuitemid: id,
      name: name, 
      quantity: 1,
      price: price,
    };
  
    setLoading(true);
    setError(null);
  
    try {
      // Check if the item is already in the cart
      const existingItem = cartItems.find(item => item.menuitemid === id);
      if (existingItem) {
        // Update quantity for the existing item
        setCartItems(cartItems.map(item =>
          item.menuitemid === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        // Add new item to the cart
        setCartItems([...cartItems, newCartItem]);
      }
  
      alert(`${name} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items data on component mount
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/menuitems');
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

  // useEffect(() => {
  //   window.location.reload();
  // }, [customer]);

  return (
    <div className="food-card">
      <div className="food-card-img-container">
        <img className="food-card-image" src={image} alt={name} loading="lazy"/>
      </div>
      <div className="food-card-info">
        <div className="food-card-name-rating">
          <h4>{name}</h4>
          <p>₱{price}</p>
        </div>
        <button 
          className="btn-cart" 
          onClick={handleAddToOrder}>Add to Cart
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default FoodItem;
