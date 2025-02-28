import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import { useProvider } from '../../../../global_variable/Provider';

const FoodItem = ({ id, name, price, image, orderId }) => {
  const { customer, cartItems, setCartItems, selectedBranch } = useProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      branch: selectedBranch, // Ensure branch is stored in cart
    };

    setLoading(true);
    setError(null);

    try {
      // Check if the item is already in the cart for the selected branch
      const existingItem = cartItems.find(item => item.menuitemid === id && item.branch === selectedBranch);
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.menuitemid === id && item.branch === selectedBranch
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, newCartItem]);
      }

      alert(`${name} has been added to your cart for ${selectedBranch}!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-card">
      <div className="food-card-img-container">
        <img className="food-card-image" src={image} alt={name} loading="lazy" />
      </div>
      <div className="food-card-info">
        <h4>{name}</h4>
        <p>₱{price}</p>
        <button className="btn-cart" onClick={handleAddToOrder}>
          Add to Cart
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default FoodItem;
