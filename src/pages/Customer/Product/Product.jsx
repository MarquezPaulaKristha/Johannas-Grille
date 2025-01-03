import React, { useState } from 'react';
import ProductCategory from '../../../components/Customer/Cart/ProductCategory/ProductCategory';
import ProductDisplay from '../../../components/Customer/Cart/ProductDisplay/ProductDisplay';

const Product = ({ orderId }) => { // Proper destructuring of props
  const [category, setCategory] = useState('All');

  return (
    <div>
      <ProductCategory category={category} setCategory={setCategory} orderId={orderId} />
      <ProductDisplay category={category} orderId={orderId} />
    </div>
  );
};

export default Product;
