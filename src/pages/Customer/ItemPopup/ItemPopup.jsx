import React, { useState, useEffect } from 'react';
import './ItemPopup.css';
import { IoIosCloseCircle } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuMinusCircle } from "react-icons/lu";

function Cart({ name }) {
  const [isVisible, setIsVisible] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/menuitems');
        const data = await response.json();
        console.log('Fetched menu items:', data); // Debugging line
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

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
            <img className="cart-item-image" src={`http://localhost:3000${item.image_url}`} alt={item.name} />
            <h3>{item.name}</h3> {/* Display the item's name */}
          </div>
          <hr />
          <div className="size-options">
            {/* Render size options dynamically */}
            {selectedItems.map((item) => (
              <div className="size-option" key={item.menuitemid}>
                <input type="radio" name="size" id={`size-${item.portion}`} />
                <label htmlFor={`size-${item.portion}`}>{item.portion}</label>
                <span className="price">P {item.price}</span>
              </div>
            ))}
            <hr />
          </div>
          <div className="quantity-control">
            <div className="quantity-button">
              <i className="decrement" onClick={handleDecrement}>
                <LuMinusCircle size={25} />
              </i>
              <span className="quantity">{quantity}</span>
              <i className="increment" onClick={handleIncrement}>
                <MdAddCircleOutline size={25} />
              </i>
            </div>
            <button className="add-to-cart">ADD TO CART</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
