import React, { useState, useEffect } from "react";
import "./MenuVariant.css";
import { useProvider } from "../../../../global_variable/provider";

const MenuVariant = ({ variants, isOpen, onClose, orderId, itemId, price }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { orderItems, setOrderItems, foodList, setFoodList } = useProvider();

  if (!isOpen) return null; // Ensure the component is not rendered when closed

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToOrder = () => {
    if (!selectedVariant && !itemId) {
      setPopupMessage("Please select a variant before adding to the order.");
      return;
    }
  
    setLoading(true);
  
    let baseMenuItemId = selectedVariant ? selectedVariant.id : itemId;
  
    // Check if baseMenuItemId is a string and split if it's a variant
    if (typeof baseMenuItemId === "string" && baseMenuItemId.includes("-")) {
      baseMenuItemId = baseMenuItemId.split('-')[0]; // Extract the base menuitemid
    }

    baseMenuItemId = Number(baseMenuItemId);
  
     // Ensure foodItems exists and find the food item from foodItems using the baseMenuItemId
    const foodItem = foodList.find((item) => item.menuitemid === baseMenuItemId);
    // Handle case where foodItem is not found
    if (!foodItem) {
      setPopupMessage("Item not found in menu.");
      setLoading(false);
      return;
    }

    const itemName = foodItem.name || "Unknown Item"; // Default to "Unknown Item" if name is not available
  
    const newOrderItem = {
      orderid: orderId,
      menuitemid: baseMenuItemId,
      name: itemName, // Combine name and variant if a variant is selected
      variant: selectedVariant ? selectedVariant.variant : null,
      quantity: 1,
      price: price,
    };
  
    // Check if the item already exists in orderItems with the same variant
    const existingItemIndex = orderItems.findIndex(
      (item) =>
        item.menuitemid === newOrderItem.menuitemid &&
        item.variant === newOrderItem.variant
    );
  
    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[existingItemIndex].quantity += 1;
      updatedOrderItems[existingItemIndex].totalAmount =
        updatedOrderItems[existingItemIndex].quantity * price;
  
      setOrderItems(updatedOrderItems);
      setPopupMessage("Item quantity updated!");
    } else {
      // If the item doesn't exist, add it to the orderItems array
      setOrderItems((prevOrderItems) => [...prevOrderItems, newOrderItem]);
      setPopupMessage("Item successfully added to your order!");
    }
  
    setLoading(false);
    onClose(); // Close the popup after adding the item or updating quantity
  };

  return (
    <div className="employee-menu-variant-popup">
      <div className="employee-menu-variant-container">
        <button className="employee-menu-variant-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="employee-menu-variant-popup-title">Menu Variant</h2>
        <div className="employee-menu-variant-popup-options">
          {variants.map((variant, index) => (
            <button
              key={index}
              className={`employee-menu-variant-option-button ${
                selectedVariant && selectedVariant.id === variant.id ? "selected" : ""
              }`}
              onClick={() => handleVariantChange(variant)}
            >
              {variant.variant}
            </button>
          ))}
        </div>
        {popupMessage && <p className="employee-menu-variant-popup-message">{popupMessage}</p>}
        <button
          className="employee-menu-variant-select-button"
          onClick={handleAddToOrder}
          disabled={loading || !selectedVariant}
        >
          {loading ? "Adding..." : "Add to Order"}
        </button>
      </div>
    </div>
  );
};

export default MenuVariant;
