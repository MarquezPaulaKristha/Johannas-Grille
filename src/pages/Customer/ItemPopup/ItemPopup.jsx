import React, { useState, useEffect } from 'react';
import './ItemPopup.css';
import { IoIosCloseCircle } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { useProvider } from '../../../global_variable/Provider';

function Cart({ name, price, orderId, setShowCartPopup }) {
  const { customer, cartItems, setCartItems } = useProvider();
  const [isVisible, setIsVisible] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [menuItems, setMenuItems] = useState([]);

  const handleClose = () => {
    setIsVisible(false);
    setShowCartPopup(false);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!customer) {
      alert("Please sign in first!");
      return;
    }

    const newCartItem = {
      orderid: orderId,
      menuitemid: name,  // Use name as the menuitemid for this example
      name: name,
      quantity: quantity,
      price: price,
    };

    try {
      // Check if the item is already in the cart
      const existingItem = cartItems.find(item => item.menuitemid === name);
      if (existingItem) {
        // Update quantity for the existing item
        setCartItems(cartItems.map(item =>
          item.menuitemid === name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        // Add new item to the cart
        setCartItems([...cartItems, newCartItem]);
      }

      setShowCartPopup(false); // Close the popup after adding to the cart
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/menuitems');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  if (!isVisible) {
    return null;
  }

  // Filter menu items based on the selected name
  const selectedItems = menuItems.filter(item => item.name === name);

  return (
    <div className="cart-container">
      {selectedItems.length > 0 && selectedItems.map((item) => (
        <div className="cart-container-content" key={item.menuitemid}>
          <div className="close">
            <button className="close-button" onClick={handleClose}>
              <IoIosCloseCircle size={25} />
            </button>
          </div>
          <div className="item-name">
            <img className="cart-item-image" src={`https://johannas-grille.onrender.com${item.image_url}`} alt={item.name} />
            <h3>{item.name}</h3>
          </div>
          <hr />
          <div className="size-options">
            {/* Display the single price */}
            <span className="price">P {price}</span>
            <hr />
          </div>
          <div className="quantity-control">
            <div className="quantity-button">
              <i className="decrement" onClick={handleDecrement}>
                <AiOutlineMinusCircle size={25} />
              </i>
              <span className="quantity">{quantity}</span>
              <i className="increment" onClick={handleIncrement}>
                <MdAddCircleOutline size={25} />
              </i>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
