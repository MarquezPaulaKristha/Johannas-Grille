import React, { useState } from "react";
import { assets } from '../../../assets/assets';
import { IoIosArrowBack } from "react-icons/io";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import Payment from "../Payment/Payment";
import './Cart.css';

const AddToCart = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch, Bauan Batangas City');
  const [isPickUp, setIsPickUp] = useState(true);
  const [pickupTime, setPickupTime] = useState('Standard 50mins'); // Default pickup time
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().substring(0, 10)); // Default to today
  const [pickupHour, setPickupHour] = useState('12:00'); // Default time

  // State for item quantities
  const [quantities, setQuantities] = useState({
    ribs: 1,
    salmon: 1,
  });

  // State for add-ons
  const [addons, setAddons] = useState({
    extraRice: false,
    drinks: false,
    salad: false,
  });
  
  // Toggle the visibility of the order summary
  const handleClick = () => {
    setShowOrder(false);
    setTimeout(() => {
      setShowOrder(true);
    }, 0);
  };

  // Close the cart
  const handleClose = () => {
    setIsVisible(false);
  };

  // Toggle dropdown for branch selection
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Select a branch from the dropdown
  const selectBranch = (branch) => {
    setSelectedBranch(branch);
    setIsDropdownOpen(false);
  };

  // Toggle between pickup and preorder
  const toggleFunction = () => {
    setIsPickUp(!isPickUp);
    console.log(isPickUp ? "Switched to PreOrder" : "Switched to PickUp");
  };

  // Change quantity for items
  const changeQuantity = (item, change) => {
    setQuantities(prevQuantities => {
      const newQuantity = Math.max(prevQuantities[item] + change, 1);
      return { ...prevQuantities, [item]: newQuantity };
    });
  };

  // Handle add-ons selection
  const handleAddonChange = (addon) => {
    setAddons(prevAddons => ({
      ...prevAddons,
      [addon]: !prevAddons[addon],
    }));
  };

  // Render nothing if the cart is not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="addtocart">
      <div className="addtocart-container">
        <header className="addtocart-header">
          <i className="back-arrow" onClick={handleClose}>
            <IoIosArrowBack size={30} />
          </i>
          <h2>My Cart</h2>

          {/* Toggle Button for Pickup and PreOrder */}
          <div className="toggle-container" onClick={toggleFunction}>
            <div className="toggle-text">
              <span>PickUp</span>
              <span>PreOrder</span>
            </div>
            <div className={`toggle-btn ${isPickUp ? 'pickup' : 'preorder'}`}></div>
          </div>
        </header>

        <section className="addtocart-branch">
          <i className="location-icon"><TbBrandGoogleMaps size={31} /></i>
          <span>{selectedBranch}</span>
          <i className="down-icon" onClick={toggleDropdown}>
            {isDropdownOpen ? <IoIosArrowUp size={28} /> : <IoIosArrowDown size={28} />}
          </i>
        </section>

        {isDropdownOpen && (
          <div className="branch-dropdown">
            <p onClick={() => selectBranch('Main Branch, Bauan Batangas City')}>Main Branch, Bauan Batangas City</p>
            <p onClick={() => selectBranch('Branch 2: Batangas City')}>Branch 2: Batangas City</p>
          </div>
        )}

        <div className="addtocart-items">
          {/* Ribs Item */}
          <div className="addtocart-item">
            <img src={assets.menu_1} alt="Babyback Ribs" className="addtocart-item-image" />
            <div className="addtocart-item-details">
              <p>Johanna's Babyback Ribs <br /><span>Large, P350</span></p>
              <div className="addtocart-item-quantity">
                <i className="quantity-btn" onClick={() => changeQuantity('ribs', -1)}><FiMinus /></i>
                <span className="quantity">{quantities.ribs}</span>
                <i className="quantity-btn" onClick={() => changeQuantity('ribs', 1)}><IoMdAdd /></i>
              </div>
            </div>
          </div>

          {/* Salmon Item */}
          <div className="addtocart-item">
            <img src={assets.menu_3} alt="Grilled Salmon" className="addtocart-item-image" />
            <div className="addtocart-item-details">
              <p>Grilled Salmon Steak <br /><span>P395</span></p>
              <div className="addtocart-item-quantity">
                <i className="quantity-btn" onClick={() => changeQuantity('salmon', -1)}><FiMinus /></i>
                <span className="quantity">{quantities.salmon}</span>
                <i className="quantity-btn" onClick={() => changeQuantity('salmon', 1)}><IoMdAdd /></i>
              </div>
            </div>
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="cart-add-ons">
          <h3>Add-ons</h3>
          <div className="addon-option">
            <label>
              <input
                type="checkbox"
                checked={addons.extraRice}
                onChange={() => handleAddonChange('extraRice')}
              />
              Extra Rice (P20)
            </label>
          </div>
          <div className="addon-option">
            <label>
              <input
                type="checkbox"
                checked={addons.drinks}
                onChange={() => handleAddonChange('drinks')}
              />
              Drinks (P50)
            </label>
          </div>
          <div className="addon-option">
            <label>
              <input
                type="checkbox"
                checked={addons.salad}
                onChange={() => handleAddonChange('salad')}
              />
              Salad (P100)
            </label>
          </div>
        </div>

        <div className="addtocart-summary">
          {/* Pickup Date and Time */}
          {isPickUp && (
            <div className="pickup-time">
              <label htmlFor="pickupDate">Pick-up Date:</label>
              <input
                type="date"
                id="pickupDate"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
              <label htmlFor="pickupHour">Pick-up Time:</label>
              <select
                id="pickupHour"
                value={pickupHour}
                onChange={(e) => setPickupHour(e.target.value)}
              >
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="1:00">1:00 PM</option>
                <option value="1:30">1:30 PM</option>
                {/* Add more time options as needed */}
              </select>
            </div>
          )}

          {/* Total Amount */}
          <div className="summary-item">
            <p className="summary-label">{isPickUp ? "Total" : "Total Amount"}</p>
            <p className="summary-value">
              P
              {isPickUp
                ? (350 * quantities.ribs + 395 * quantities.salmon + 50 +
                   (addons.extraRice ? 20 : 0) +
                   (addons.drinks ? 50 : 0) +
                   (addons.salad ? 100 : 0))
                : (350 * quantities.ribs + 395 * quantities.salmon +
                   (addons.extraRice ? 20 : 0) +
                   (addons.drinks ? 50 : 0) +
                   (addons.salad ? 100 : 0))}
              .00
            </p>
          </div>
        </div>

        <div className="bott">
          <button className="finalize-btn" onClick={handleClick}>FINALIZE ORDER
          </button>
        </div>
      </div>

      {/* Conditional rendering for the Finalize Order component */}
      {showOrder && (
        <Payment
          selectedBranch={selectedBranch}
          quantities={quantities}
          addons={addons}
          pickupDate={pickupDate}
          pickupHour={pickupHour}
          isPickUp={isPickUp}
          onClose={() => setShowOrder(false)}
        />
      )}
    </div>
  );
};

export default AddToCart;


