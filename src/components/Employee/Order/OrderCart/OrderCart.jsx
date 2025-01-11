import React, { useState, useEffect } from 'react';
import OrderItem from '../OrderItem';
import PlaceOrderPopup from '../PlaceOrderPopup/PlaceOrderPopup';
import './OrderCart.css';
import { useProvider } from '../../../../global_variable/provider';
import GCashOrderPopup from '../GCashOrderPopup/GCashOrderPopup';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import ItemDisplay from '../ItemDisplay/ItemDisplay';

const OrderCart = ({ category, setCategory, orderId }) => {
  const { orderItems, setOrderItems, orderType, setOrderType, selectedEmployeeBranch, setSelectedEmployeeBranch } = useProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlaceOrderPopup, setShowPlaceOrderPopup] = useState(false);
  const [gcashOrderPopup, setGCashOrderPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectBranch = (branch) => {
    setSelectedEmployeeBranch(branch); // Update selected branch state
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const updatedItems = orderItems.map((item) =>
      item.menuitemid === itemId ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(updatedItems);

    // if (newQuantity <= 0) {
    //   await handleRemoveItem(itemId);
    // } else {
    //   await updateOrder();
    // }
  };

  return (
    <div className="em-product-menu">
      <h1 className="menu-title">Product Menu</h1>
      <div className="emp-product-menu-list">
        {/* Category and items rendering */}
      </div>
      <div className="em-ordercart">
        <h2>Cart</h2>
        <section className="addtocart-branch">
          <i className="location-icon">
            <TbBrandGoogleMaps size={31} />
          </i>
          <span>{selectedEmployeeBranch === 'Bauan' ? 'Main Branch, Bauan Batangas' : 'Branch 2: Batangas City'}</span>
          <i className="down-icon" onClick={toggleDropdown}>
            {isDropdownOpen ? <IoIosArrowUp size={28} /> : <IoIosArrowDown size={28} />}
          </i>
        </section>
        {isDropdownOpen && (
          <div className="branch-dropdown">
            <p onClick={() => selectBranch("Bauan")}>Main Branch, Bauan Batangas</p>
            <p onClick={() => selectBranch("Batangas")}>Branch 2: Batangas City</p>
          </div>
        )}
        <div className="order-id">
          <h6>Order ID: {orderId}</h6>
        </div>
        <div className="order-type">
          <label>
            <input
              type="radio"
              name="orderType"
              value="Dine In"
              checked={orderType === 'Dine In'}
              onChange={(e) => setOrderType(e.target.value)}
            />
            Dine In
          </label>
          <label>
            <input
              type="radio"
              name="orderType"
              value="Takeout"
              checked={orderType === 'Takeout'}
              onChange={(e) => setOrderType(e.target.value)}
            />
            Takeout
          </label>
        </div>
        <div>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <OrderItem
                key={item.menuitemid}
                item={item}
                increaseQuantity={() => handleQuantityChange(item.menuitemid, item.quantity + 1)}
                decreaseQuantity={() =>
                  handleQuantityChange(item.menuitemid, item.quantity === 1 ? 0 : item.quantity - 1)
                }
              />
            ))
          ) : (
            <div>No items in your order.</div>
          )}
        </div>
        <div className="em-order-buttons">
          <div className="em-order-placeorder">
            <button onClick={() => setShowPlaceOrderPopup(true)} disabled={orderItems.length === 0}>Cash</button>
          </div>
          <div className="em-order-placeorder">
            <button onClick={() => setGCashOrderPopup(true)} disabled={orderItems.length === 0}>G-Cash</button>
          </div>
        </div>
      </div>
      {showPlaceOrderPopup && (
        <PlaceOrderPopup
          onCancel={() => setShowPlaceOrderPopup(false)}
        />
      )}

      {gcashOrderPopup && (
        <GCashOrderPopup
          orderItems={orderItems}
          orderType={orderType}
          onCancel={() => setGCashOrderPopup(false)}
        />
      )}
    </div>
  );
};

export default OrderCart;
