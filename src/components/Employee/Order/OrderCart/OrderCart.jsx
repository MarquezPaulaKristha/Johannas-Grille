import React, { useState, useEffect } from 'react';
import OrderItem from '../OrderItem';
import PlaceOrderPopup from '../PlaceOrderPopup/PlaceOrderPopup';
import './OrderCart.css';
import { useProvider } from '../../../../global_variable/provider';
import GCashOrderPopup from '../GCashOrderPopup/GCashOrderPopup';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";

const OrderCart = ({ category, setCategory, orderId }) => {
  const { orderItems, setOrderItems, orderType, setOrderType, selectedEmployeeBranch, setSelectedEmployeeBranch } = useProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlaceOrderPopup, setShowPlaceOrderPopup] = useState(false);
  const [gcashOrderPopup, setGCashOrderPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateOrder = async () => {
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordertype: orderType, totalamount: totalAmount }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await response.json();
      console.log('Order updated successfully:', updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error.message);
      alert('Failed to update order.');
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectBranch = (branch) => {
    setSelectedEmployeeBranch(branch); // Update selected branch state
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const updatedItems = orderItems.map((item) =>
      item.orderitemid === itemId ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(updatedItems);

    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
    } else {
      await updateOrder();
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orderitems/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setOrderItems(orderItems.filter((item) => item.orderitemid !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item.');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const totalAmount = orderItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );
      const customerId = '0000'; // Replace with actual customer ID

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = currentDate.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS

      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: String(customerId),
          orderType,
          totalAmount,
          date: formattedDate,
          time: formattedTime,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Server responded with error:', errorDetails);
        throw new Error(errorDetails.message || 'Order update failed.');
      }

      const result = await response.json();
      alert(`Order updated successfully! Order ID: ${result.orderid}`);
      setShowPlaceOrderPopup(false);
      setOrderItems([]); // Clear cart after placing order
    } catch (error) {
      console.error('Error confirming order:', error.message);
      alert(`Failed to update order: ${error.message}`);
    }
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
                increaseQuantity={() => handleQuantityChange(item.orderitemid, item.quantity + 1)}
                decreaseQuantity={() =>
                  handleQuantityChange(item.orderitemid, item.quantity === 1 ? 0 : item.quantity - 1)
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
          onConfirm={handleConfirmOrder}
        />
      )}

      {gcashOrderPopup && (
        <GCashOrderPopup
          orderItems={orderItems}
          orderType={orderType}
          onCancel={() => setGCashOrderPopup(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
};

export default OrderCart;
