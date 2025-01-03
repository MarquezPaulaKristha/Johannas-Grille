import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerReservationPayment from "../CustomerReservationPayment/CustomerReservationPayment";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./CustomerReservationMenu.css";
import { useProvider } from "../../../../global_variable/provider";

const CustomerReservationMenu = ({ reservationDetails, onClose, reservationId }) => {
    const { reserveItems, setReserveItems, customer, setPayloadDetails } = useProvider();
    const [menuItems, setMenuItems] = useState({});
    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedSideDishes, setSelectedSideDishes] = useState({});
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/menu-items");
                const data = await response.json();

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

                // Initialize selection states
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

    const handleCategorySelection = (category) => {
        setSelectedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleSideDishSelection = (category, sideCategory, item) => {
        setSelectedSideDishes((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [sideCategory]: 
                    prev[category]?.[sideCategory]?.menuitemid === item.menuitemid 
                        ? null 
                        : item,
            },
        }));
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
                    alert(`Please select one side dish for each side category in ${category}.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleFinalSubmit = async () => {
        if (!validateSelection()) return;
    
        try {
            const gcashPayload = Object.keys(selectedCategories)
            .filter((category) => selectedCategories[category])
            .map((category) => ({
                name: category, 
                quantity: 1, 
                price: menuItems[category]?.package_price || 0,
            }));
    
            const body = { lineItems: gcashPayload };
            console.log(body);
    
            const response = await axios.post('http://localhost:3000/api/reservation-gcash-checkout', body);
            const { url } = response.data;
    
            window.location.href = url;
        } catch (error) {
            console.error('Error initiating payment:', error);
            return;
        }
    
        try {
            const payload = [];
            let totalAmount = 0;
    
            Object.keys(selectedCategories).forEach((category) => {
                if (selectedCategories[category]) {
                    const { Main, Sides } = menuItems[category];
                    const categoryPrice = parseFloat(menuItems[category]?.package_price) || 0;
                    totalAmount += categoryPrice;

                    // Add all main dishes
                    Main.forEach((item) => {
                        payload.push({
                            reservationId,
                            customerid: customer.customerid, // assuming reservationDetails has customerId
                            numberOfGuests: reservationDetails.numberofguests, // assuming number of guests is in reservationDetails
                            reservationDate: reservationDetails.reservationdate, // assuming date is in reservationDetails
                            reservationTime: `${reservationDetails.reservationtime}:00`, // assuming time is in reservationDetails
                            branch: reservationDetails.branch, // assuming branch is in reservationDetails
                            amount: totalAmount || 0, // Set amount to price of the main dish
                            modeOfPayment: "GCash",
                            status: "Approved", // default status
                            menuItemId: item.menuitemid,
                            quantity: 1,
                        });
                    });
    
                    // Add selected side dishes
                    Object.values(selectedSideDishes[category] || {}).forEach((item) => {
                        if (item) {
                            payload.push({
                                reservationId,
                                customerid: customer.customerid,
                                numberOfGuests: reservationDetails.numberofguests,
                                reservationDate: reservationDetails.reservationdate,
                                reservationTime: `${reservationDetails.reservationtime}:00`,
                                branch: reservationDetails.branch,
                                amount: totalAmount || 0, // Set amount to price of the side dish
                                modeOfPayment: "GCash",
                                status: "Approved",
                                menuItemId: item.menuitemid,
                                quantity: 1,
                            });
                        }
                    });
                }
            });

            payload.forEach(reservation => {
                reservation.amount = totalAmount; 
            });

            setPayloadDetails(payload);

        } catch (error) {
            console.error("Error submitting reservation:", error);
        }
    };

    // Check if any category has been selected
    const isAnyCategorySelected = Object.values(selectedCategories).includes(true);

    return (
        <div className="cust-res-menu-popup">
            <div className="cust-res-menu-popup-content">
                <button className="cust-res-menu-popup-close" onClick={onClose}>
                    <IoIosCloseCircleOutline size={33} />
                </button>
                <h2>Choose Your Package</h2>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {Object.keys(menuItems).map((category) => (
                        <div key={category} className="menu-category">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories[category]}
                                    onChange={() => handleCategorySelection(category)}
                                />
                                <h3>{category} - {menuItems[category].package_price}</h3>
                            </label>

                            {selectedCategories[category] && (
                                <>
                                    {/* Main Dishes */}
                                    <div>
                                        <h4>Main Dishes</h4>
                                        {menuItems[category].Main.map((item) => (
                                            <div key={item.menuitemid} className="menu-item">
                                                {item.item_name}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Side Dishes */}
                                    {Object.keys(menuItems[category].Sides).map((sideCategory) => (
                                        <div key={sideCategory}>
                                            <h4>{sideCategory}</h4>
                                            {menuItems[category].Sides[sideCategory].map((item) => (
                                                <div key={item.menuitemid} className="menu-item">
                                                    <label>
                                                    <input
                                                        type="radio"
                                                        name={`side-${category}-${sideCategory}`}
                                                        checked={
                                                            selectedSideDishes[category]?.[sideCategory]?.menuitemid === item.menuitemid
                                                        }
                                                        onChange={() =>
                                                            handleSideDishSelection(category, sideCategory, item)
                                                        }
                                                    />
                                                        {item.item_name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handleFinalSubmit} 
                    disabled={!isAnyCategorySelected}
                >
                    Confirm Selection
                </button>
                {isPaymentOpen && <CustomerReservationPayment reservationId={reservationId} onClose={onClose} />}
            </div>
        </div>
    );
};

export default CustomerReservationMenu;
