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
    const [selectedSides, setSelectedSides] = useState({}); // Track selected side dishes
    const [quantities, setQuantities] = useState({});
    const [cart, setCart] = useState([]); // Cart to store selected items
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("https://johannas-grille.onrender.com/api/menu-items");
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
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleMenuSelection = (category) => {
        setSelectedMenu(selectedMenu === category ? null : category); // Toggle selection
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

    const handleSideSelection = (category, sideCategory, item) => {
        setSelectedSides(prev => ({
            ...prev,
            [category]: { sideCategory, item },
        }));
    };

    const addToCart = (category) => {
        if (menuItems[category]) {
            const { Main, Sides } = menuItems[category];
            const categoryPrice = parseFloat(menuItems[category]?.package_price) || 0;
            const quantity = quantities[category] || 1;

            const cartItems = [...cart];

            // Add Main dishes to the cart if not already added
            Main.forEach((item) => {
                // Only add if not already in the cart
                if (!cartItems.some(cartItem => cartItem.itemName === item.item_name)) {
                    cartItems.push({
                        itemName: item.item_name,
                        price: item.price,
                        quantity: quantity,
                    });
                }
            });

            // Ensure a side dish is selected before adding to the cart
            if (selectedSides[category]) {
                const { sideCategory, item } = selectedSides[category];
                // Add the selected side dish to the cart
                cartItems.push({
                    itemName: item.item_name,
                    price: item.price,
                    quantity: quantity,
                });
            } else if (Object.keys(Sides).length > 0) {
                // If the category has sides but none are selected, do not add to the cart
                return;
            }

            // Update the cart
            setCart(cartItems);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            const payload = [];
            let totalAmount = 0;

            cart.forEach(item => {
                totalAmount += item.price * item.quantity;

                payload.push({
                    reservationId,
                    customerid: customer.customerid,
                    numberOfGuests: reservationDetails.numberofguests,
                    reservationDate: reservationDetails.reservationdate,
                    reservationTime: `${reservationDetails.reservationtime}:00`,
                    branch: reservationDetails.branch,
                    amount: totalAmount || 0,
                    modeOfPayment: "GCash",
                    status: "Approved",
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                });
            });

            setPayloadDetails(payload);
            setIsPaymentOpen(true); // Show payment form after submission
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
                                                        onChange={() => handleSideSelection(selectedMenu, sideCategory, item)}
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
                            <button onClick={() => addToCart(selectedMenu)} className="cust-reserve-menu-add-to-cart">
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
                <CustomerReservationMenuCart cart={cart} handleFinalSubmit={handleFinalSubmit} />
            </div>
        </div>
    );
};

export default CustomerReservationMenu;
