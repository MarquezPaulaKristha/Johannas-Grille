import React from "react";
import "./ProductItem.css";

const ProductItem = ({ item, increaseQuantity, decreaseQuantity }) => {
  const price = parseFloat(item.price) || 0;

  return (
    <div className="addtocart-items">
      <img
        src={item.image_url}
        alt={item.name}
        className="addtocart-item-image"
      />
      <div className="addtocart-item-details">
        <p className="addtocart-item-name">
          {item.name} <br />
          <span className="addtocart-item-price">P{price.toFixed(2)}</span>
        </p>
        <div className="addtocart-item-quantity">
          <button
            onClick={decreaseQuantity}
            className="quantity-btn decrease-btn"
            disabled={item.quantity <= 0}
          >
            -
          </button>
          <span className="addtocart-quantity-value">{item.quantity}</span>
          <button
            onClick={increaseQuantity}
            className="quantity-btn increase-btn"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
