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
  const [showOrder, setShowOrder] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Set default pickup date when component mounts
  useEffect(() => {
    if (!pickupDate) {
      setPickupDate(getCurrentDate());
    }
  }, [pickupDate, setPickupDate]);

  // Update quantity handler
  const updateQuantity = (id, change) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.menuitemid === id
          ? { ...item, quantity: item.quantity + change } // Update quantity
          : item
      );

      // Remove the item if quantity is less than or equal to 0
      return updatedItems.filter(item => {
        if (item.menuitemid === id && item.quantity <= 1 && change === -1) {
          return false; // Remove the item
        }
        return true; // Keep the item
      });
    });
  };

  // Dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Select branch
  const selectBranch = branch => {
    setSelectedBranch(branch);
    setIsDropdownOpen(false);
    setCartItems([]); // Clear cart when branch is changed
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
                key={item.menuitemid}
                item={item}
                image={`https://johannas-grille.onrender.com${item.image_url}`}
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
              min={getCurrentDate()} // Prevent selecting past dates
              onChange={e => setPickupDate(e.target.value)}
            />
            <label htmlFor="pickupHour">Pick-up Time:</label>
            <select
              id="pickupHour"
              value={pickupHour}
              onChange={e => setPickupHour(e.target.value)}
            >
              <option value="09:00">9:00 AM</option>
              <option value="09:30">9:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="12:30">12:30 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="13:30">1:30 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="14:30">2:30 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="15:30">3:30 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="16:30">4:30 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="17:30">5:30 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="18:30">6:30 PM</option>
              <option value="19:00">7:00 PM</option>
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