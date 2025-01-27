import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ProductPayment from "../ProductPayment/ProductPayment";
import "./ProductCart.css";
import ProductItem from "../../Cart/ProductItem/ProductItem";
import { useProvider } from "../../../../global_variable/Provider";

const ProductCart = ({ orderId }) => {
  const { selectedBranch, setSelectedBranch, cartItems, setCartItems, pickupDate, setPickupDate, pickupHour, setPickupHour } = useProvider();
  const [isVisible, setIsVisible] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update quantity handler
  // Update quantity handler
  // Update quantity handler
  const updateQuantity = (id, change) => {
    setCartItems(prevItems => {
      // If the quantity is 1 and we try to decrement it, remove the item from the cart
      const updatedItems = prevItems.map(item =>
        item.menuitemid === id
          ? { ...item, quantity: item.quantity === 1 && change === -1 ? 0 : Math.max(1, item.quantity + change) }
          : item
      );

      // Remove items with quantity 0 (after decrementing)
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  // Dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Select branch
  const selectBranch = branch => {
    setSelectedBranch(branch);
    setIsDropdownOpen(false);
    setCartItems([]);
  };

  if (!isVisible) return null;

  return (
    <div className="addtocart">
      <div className="addtocart-container">
        <header className="addtocart-header">
          <i className="back-arrow" onClick={() => setIsVisible(false)}>
            <IoIosArrowBack size={30} />
          </i>
          <h2>My Cart</h2>
          <div className="pickup-label-container">
            <div className="pickup-label">
              <span>PickUp</span>
            </div>
          </div>
        </header>

        <section className="addtocart-branch">
          <i className="location-icon">
            <TbBrandGoogleMaps size={31} />
          </i>
          <span>{selectedBranch === 'Bauan' ? 'Main Branch, Bauan Batangas' : 'Branch 2: Batangas City'}</span>
          <i className="down-icon" onClick={toggleDropdown}>
            {isDropdownOpen ? <IoIosArrowUp size={28} /> : <IoIosArrowDown size={28} />}
          </i>
        </section>
        <h3>Order ID: {orderId}</h3>

        {isDropdownOpen && (
          <div className="branch-dropdown">
            <p onClick={() => selectBranch("Bauan")}>
              Main Branch, Bauan Batangas
            </p>
            <p onClick={() => selectBranch("Batangas")}>
              Branch 2: Batangas City
            </p>
          </div>
        )}

        <div>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <ProductItem
                key={item.orderid}
                item={item}
                increaseQuantity={() => updateQuantity(item.menuitemid, 1)}
                decreaseQuantity={() => updateQuantity(item.menuitemid, -1)}
              />
            ))
          ) : (
            <div>No items in your order.</div>
          )}
        </div>

        <div className="addtocart-summary">
          <div className="pickup-time">
            <label htmlFor="pickupDate">Pick-up Date:</label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={e => setPickupDate(e.target.value)}
            />
            <label htmlFor="pickupHour">Pick-up Time:</label>
            <select
              id="pickupHour"
              value={pickupHour}
              onChange={e => setPickupHour(e.target.value)}
            >
              <option value="12:00">12:00 PM</option>
              <option value="12:30">12:30 PM</option>
              <option value="1:00">1:00 PM</option>
              <option value="1:30">1:30 PM</option>
            </select>
          </div>

          <div className="summary-item">
            <p className="summary-label">Total</p>
            <p className="summary-value">
              P
              {cartItems
                .reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bott">
          <button className="finalize-btn" onClick={() => setShowOrder(true)}>
            FINALIZE ORDER
          </button>
        </div>
      </div>

      {showOrder && (
        <ProductPayment
          selectedBranch={selectedBranch}
          orderItems={cartItems}
          pickupDate={pickupDate}
          pickupHour={pickupHour}
          onClose={() => setShowOrder(false)}
        />
      )}
    </div>
  );
};

export default ProductCart;
