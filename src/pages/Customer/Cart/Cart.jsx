import React, { useEffect } from 'react';
import ProductCart from '../../../components/Customer/Product/ProductCart/ProductCart';

const Cart = ({ orderId }) => {
  useEffect(() => {
    console.log("Current Order ID in Cart:", orderId); // Log the orderId whenever it changes
  }, [orderId]); // Dependency array to track changes in orderId

  return (
    <div>
      <ProductCart orderId={orderId} />
    </div>
  );
};

export default Cart;
