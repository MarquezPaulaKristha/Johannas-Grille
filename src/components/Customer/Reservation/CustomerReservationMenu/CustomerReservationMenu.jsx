import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./CustomerReservationMenu.css";
import { useProvider } from "../../../../global_variable/Provider";
import CustomerReservationMenuCart from "../CustomerReservationMenuCart/CustomerReservationMenuCart"; // Import the Cart component

const CustomerReservationMenu = ({ reservationDetails, onClose, reservationId }) => {
    const { reserveItems, setReserveItems, customer, setPayloadDetails } = useProvider();
    const [menuItems, setMenuItems] = useState({});
    const [selectedMenu, setSelectedMenu] = useState(null); // Track selected menu
    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedSideDishes, setSelectedSideDishes] = useState({});
    const [quantities, setQuantities] = useState({});
    const [cart, setCart] = useState([]); // Cart to store selected items
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("https://johannasgrille.onrender.comapi/menu-items"); //https://johannasgrille.onrender.com https://johannasgrille.onrender.com
                const data = response.data;

                const organizedData = data.reduce((acc, item) => {
                    const category = item.menu_name;
                    if (!acc[category]) acc[category] = { Main: [], Sides: {}, package_price: item.package_price };

                    if (item.side_dish.includes("Main")) {
                        acc[category].Main.push(item);
                    } else {
                        const sideCategory = item.side_dish || "Other Sides";
                        if (!acc[category].Sides[sideCategory]) acc[category].Sides[sideCategory] = [];
                        acc[category].Sides[sideCategory].push(item);
                    }
                    return acc;
                }, {});

                setMenuItems(organizedData);

                // Initialize quantities for each menu category
                const initialQuantities = Object.keys(organizedData).reduce((acc, category) => {
                    acc[category] = 1;  // Default quantity for entire category
                    return acc;
                }, {});

                setQuantities(initialQuantities);

                const initialSelectedCategories = Object.keys(organizedData).reduce((acc, category) => {
                    acc[category] = false;
                    return acc;
                }, {});

                const initialSelectedSideDishes = Object.keys(organizedData).reduce((acc, category) => {
                    acc[category] = {};
                    return acc;
                }, {});

                setSelectedCategories(initialSelectedCategories);
                setSelectedSideDishes(initialSelectedSideDishes);

            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleSideDishSelection = (category, sideCategory, item) => {
        setSelectedSideDishes((prev) => {
            // Retain previous selections for other categories
            const updatedCategory = {
                ...prev[category],
                [sideCategory]: prev[category]?.[sideCategory]?.menuitemid === item.menuitemid ? null : item,
            };
    
            return {
                ...prev,
                [category]: updatedCategory,
            };
        });
    };

    const validateSelection = () => {
        for (const category in selectedCategories) {
            if (selectedCategories[category]) {
                const sideDishes = selectedSideDishes[category];
                const allSideCategories = menuItems[category]?.Sides || {};
                const selectedSides = Object.keys(allSideCategories).every(
                    (sideCategory) => sideDishes[sideCategory]
                );
                if (!selectedSides) {
                    alert(`Please select at least one side dish for each side category in ${category}.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleMenuSelection = (category) => {
        setSelectedMenu(selectedMenu === category ? null : category); // Toggle selection
        setSelectedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleQuantityChange = (category, change) => {
        setQuantities((prev) => {
            const newQuantity = prev[category] + change;
            return {
                ...prev,
                [category]: newQuantity > 0 ? newQuantity : 1, // Prevent going below 1
            };
        });
    };

    const handleIncreaseQuantity = (index) => {
        const updatedCart = [...cart];
    
        // Increase the quantity of the whole menu item
        updatedCart[index].quantity += 1;
    
        // Increase the quantity for all main dishes in the current item
        updatedCart[index].mainDishes.forEach(dish => {
            dish.quantity += 1;
        });
    
        // Increase the quantity for all side dishes in the current item
        updatedCart[index].sideDishes.forEach(side => {
            side.quantity += 1;
        });
    
        setCart(updatedCart);
    };
    
    const handleDecreaseQuantity = (index) => {
        const updatedCart = [...cart];
    
        // Decrease the quantity of the whole menu item
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
    
            // Decrease the quantity for all main dishes in the current item
            updatedCart[index].mainDishes.forEach(dish => {
                if (dish.quantity > 1) dish.quantity -= 1;
            });
    
            // Decrease the quantity for all side dishes in the current item
            updatedCart[index].sideDishes.forEach(side => {
                if (side.quantity > 1) side.quantity -= 1;
            });
        }
    
        setCart(updatedCart);
    };
    
    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const addToCart = (category) => {
        if (!validateSelection()) return;
    
        const { Main, Sides } = menuItems[category];
        const selectedSidesForCategory = selectedSideDishes[category];
        const quantity = quantities[category];
    
        // Create a new cart entry
        const newCartEntry = {
            menu: category,
            mainDishes: Main.map(item => ({
                menuitemid: item.menuitemid,
                itemName: item.item_name,
                quantity,
            })),
            sideDishes: Object.keys(selectedSidesForCategory).map(sideCategory => ({
                sideCategory,
                menuitemid: selectedSidesForCategory[sideCategory].menuitemid,
                itemName: selectedSidesForCategory[sideCategory].item_name,
                quantity,
            })),
            quantity,
            packagePrice: menuItems[category]?.package_price,
        };
    
        // Check if the menu is already in the cart
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(item => item.menu === category);
            if (existingItemIndex !== -1) {
                // If the item is already in the cart, update its details
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;  // Update quantity
                updatedCart[existingItemIndex].mainDishes.forEach(dish => {
                    dish.quantity += quantity;  // Update main dish quantities
                });
                updatedCart[existingItemIndex].sideDishes = updatedCart[existingItemIndex].sideDishes.map(side => {
                    const newSideDish = selectedSidesForCategory[side.sideCategory];
                    if (newSideDish) {
                        return {
                            sideCategory: side.sideCategory,
                            menuitemid: newSideDish.menuitemid,
                            itemName: newSideDish.item_name,
                            quantity, // Update quantity of the side dish
                        };
                    }
                    return side; // Keep the existing side if no new side is selected
                });
                return updatedCart;
            } else {
                // If the item is not in the cart, add the new entry
                return [...prevCart, newCartEntry];
            }
        });
    };

    const handleFinalSubmit = async () => {

        try {
            const gcashPayload = cart.map((item) => {
                // Iterate through each item in the cart
                const { menu, packagePrice, quantity } = item;
        
                // Total price for this cart item
                const totalItemPrice = parseFloat(packagePrice).toFixed(2);
        
                return {
                    name: menu,  
                    quantity: quantity || 0, 
                    price: totalItemPrice || 0,  
                };
            });
        
            const body = { lineItems: gcashPayload };
        
            const response = await axios.post('https://johannasgrille.onrender.comapi/reservation-gcash-checkout', body);
            const { url } = response.data;
        
            window.location.href = url;
        } catch (error) {
            console.error('Error initiating payment:', error);
        }

        try {
            const payload = [];
            let totalAmount = 0;
        
            // Iterate through each menu item in the cart
            cart.forEach((item) => {
                const categoryPrice = parseFloat(item.packagePrice) || 0;
                totalAmount += categoryPrice * item.quantity;  // Accumulate price * quantity for each menu item
                
                // Process each main dish in the cart item
                item.mainDishes.forEach((mainDish) => {
                    payload.push({
                        reservationId,
                        customerid: customer.customerid,
                        numberOfGuests: reservationDetails.numberofguests,
                        reservationDate: reservationDetails.reservationdate,
                        reservationTime: `${reservationDetails.reservationtime}:00`,
                        branch: reservationDetails.branch,
                        amount: totalAmount || 0,  // Set amount to the cumulative total amount
                        modeOfPayment: "GCash",
                        status: "Approved",
                        menuItemId: mainDish.menuitemid,
                        quantity: item.quantity,  // Quantity is taken from the cart
                    });
                });
        
                // Process each side dish in the cart item
                item.sideDishes.forEach((sideDish) => {
                    payload.push({
                        reservationId,
                        customerid: customer.customerid,
                        numberOfGuests: reservationDetails.numberofguests,
                        reservationDate: reservationDetails.reservationdate,
                        reservationTime: `${reservationDetails.reservationtime}:00`,
                        branch: reservationDetails.branch,
                        amount: totalAmount || 0,  // Set amount to the cumulative total amount
                        modeOfPayment: "GCash",
                        status: "Approved",
                        menuItemId: sideDish.menuitemid,
                        quantity: item.quantity,  // Quantity is taken from the cart
                    });
                });
            });
        
            // Optionally, if you want to log or set the payload:
            setPayloadDetails(payload); // Uncomment when you want to use the payload
        
        } catch (error) {
            console.error("Error submitting reservation:", error);
        }
    };

    return (
        <div className="cust-reserve-menu-popup">
            <div className="cust-reserve-menu-popup-content">
                <button className="cust-reserve-menu-popup-close" onClick={onClose}>
                    <IoIosCloseCircleOutline size={33} />
                </button>
                <h2 className="cust-reserve-menu-header">Choose Your Package</h2>
                <div className="cust-reserve-menu-navbar">
                    {Object.keys(menuItems).map((category) => (
                        <div
                            key={category}
                            className={`cust-reserve-menu-navbar-item ${selectedMenu === category ? "active" : ""}`}
                            onClick={() => handleMenuSelection(category)}
                            // onChange={() => handleCategorySelection(category)}
                        >
                            {category} - {menuItems[category].package_price}
                        </div>
                    ))}
                </div>
                <div>
                    {selectedMenu && menuItems[selectedMenu] && (
                        <div className="cust-reserve-menu-category-details">
                            <h3 className="cust-reserve-menu-category-title">{selectedMenu}</h3>
                            <div>
                                <h4 className="cust-reserve-menu-category-subtitle">Main Dishes</h4>
                                {menuItems[selectedMenu].Main.map((item) => (
                                    <div key={item.menuitemid} className="cust-reserve-menu-item">
                                        <span>{item.item_name}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                {Object.keys(menuItems[selectedMenu].Sides).map((sideCategory) => (
                                    <div key={sideCategory}>
                                        <h4 className="cust-reserve-menu-category-subtitle">{sideCategory}</h4>
                                        {menuItems[selectedMenu].Sides[sideCategory].map((item) => (
                                            <div key={item.menuitemid} className="cust-reserve-menu-item">
                                                <label className="cust-reserve-menu-item-label">
                                                    <input
                                                        type="radio"
                                                        name={`side-${selectedMenu}-${sideCategory}`}
                                                        className="cust-reserve-menu-item-input"
                                                        onChange={() =>
                                                            handleSideDishSelection(selectedMenu, sideCategory, item)
                                                        }
                                                        checked={
                                                            selectedSideDishes[selectedMenu]?.[sideCategory]?.menuitemid ===
                                                            item.menuitemid
                                                        }
                                                    />
                                                    {item.item_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="cust-reserve-menu-category-quantity">
                                <label htmlFor={`quantity-${selectedMenu}`} className="cust-reserve-menu-quantity-label">
                                    Quantity for {selectedMenu}:
                                </label>
                                <div className="cust-reserve-menu-quantity-controls">
                                    <button
                                        className="cust-reserve-menu-quantity-button"
                                        onClick={() => handleQuantityChange(selectedMenu, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="cust-reserve-menu-quantity-number">{quantities[selectedMenu]}</span>
                                    <button
                                        className="cust-reserve-menu-quantity-button"
                                        onClick={() => handleQuantityChange(selectedMenu, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={() => addToCart(selectedMenu)} 
                                className="cust-reserve-menu-add-to-cart"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
                <CustomerReservationMenuCart 
                    cart={cart} 
                    handleFinalSubmit={handleFinalSubmit}
                    handleDecreaseQuantity={handleDecreaseQuantity}
                    handleIncreaseQuantity={handleIncreaseQuantity}
                    handleRemoveItem={handleRemoveItem}
                />
            </div>
        </div>
    );
};

export default CustomerReservationMenu;