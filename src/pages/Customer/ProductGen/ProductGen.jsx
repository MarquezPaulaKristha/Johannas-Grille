import React, { useState, useEffect } from 'react';
import Product from '../Product/Product';
import Cart from '../Cart/Cart'

const generateOrderId = () => {
  return Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
};

const Product = () => {
  const [category, setCategory] = useState("All");
  const [orderId, setOrderId] = useState(generateOrderId());

  const createNewOrder = () => {
    setOrderId(generateOrderId()); // Generate a new 5-digit random order ID
  };

  // Update `orderId` whenever the category changes
  useEffect(() => {
    createNewOrder();
  }, [category]);

  return (
    <div>
      {/* Pass `orderId` to child components */}
      <ProductCategory category={category} setCategory={setCategory} orderId={orderId} />
      <ProductDisplay category={category} orderId={orderId} />
    </div>
  );
};

export default Product;
