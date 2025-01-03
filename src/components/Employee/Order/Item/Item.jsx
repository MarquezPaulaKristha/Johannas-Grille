import React, { useState } from 'react';
import './Item.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import MenuVariant from "../MenuVariant/MenuVariant"; // Import the popup component

const FoodItem = ({ id, name, variants, price, image, orderId }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Manage popup visibility

  const openMenuVariantPopup = () => {
    setIsPopupOpen(true);
  };

  return (
    <div className="emp-menu-container">
      <div className="emp-item-food-card">
        <div className="emp-item-food-card-img-container">
          <img
            className="emp-item-food-card-image object-contain w-full rounded-3xl aspect-[1.13]"
            src={image}
            alt={name}
            loading="lazy"
          />
        </div>
        <div className="emp-item-food-card-info">
          <div className="emp-item-food-card-name-rating">
            <h3 className="emp-product-name">{name}</h3>
            <p className="emp-product-price">₱{price}</p>
          </div>
        </div>
        <div className="emp-edit-delete-container">
          <button
            onClick={openMenuVariantPopup}
            className="emp-item-btn-cart add-button"
          >
            <IoMdAddCircleOutline size={25} />
          </button>
        </div>
      </div>

      {/* Menu Variant Popup */}
      <MenuVariant
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        variants={variants}  // Pass the variants correctly
        orderId={orderId}
        itemId={id}  // Pass the base item ID
        price={price}
      />
    </div>
  );
};

export default FoodItem;
