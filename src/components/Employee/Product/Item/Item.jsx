import React, { useState, useEffect } from 'react';
import './Item.css';
import EditPopup from './EditPopup';
import { RiEditLine } from "react-icons/ri";

const FoodItem = ({ id, name, price, description, image, category, availability }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [foodName, setFoodName] = useState(name);
  const [foodPrice, setFoodPrice] = useState(price);
  const [foodImage, setFoodImage] = useState(image);
  const [foodCategory, setFoodCategory] = useState(category);
  const [foodAvailability, setFoodAvailability] = useState(availability);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menuitems');
      const data = await response.json();
      // Find the updated item by id and update the states
      const updatedItem = data.find((item) => item.id === id);
      if (updatedItem) {
        setFoodName(updatedItem.name);
        setFoodPrice(updatedItem.price);
        setFoodImage(updatedItem.image);
        setFoodCategory(updatedItem.category);
        setFoodAvailability(updatedItem.availability);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = (updatedData) => {
    setFoodName(updatedData.updatedName);
    setFoodPrice(updatedData.updatedPrice);
    setFoodAvailability(updatedData.updatedAvailability);
    if (updatedData.updatedImage) {
      setFoodImage(URL.createObjectURL(updatedData.updatedImage));
    }
  };

  useEffect(() => {
      fetchData(); // Fetch data when the edit popup is shown
  }, []);

  return (
    <div className="em-item-food-card">
      <div className="em-item-food-card-img-container">
        <img className="em-item-food-card-image" src={foodImage} alt={foodName} />
      </div>
      <div className="em-item-food-card-info">
        <div className="em-item-food-card-name-rating">
          <p>{foodName}</p>
        </div>
      </div>
      <div className="edit-delete-container">
        <div className="edit-btn">
          <button className="em-item-btn-cart" onClick={() => setShowEditPopup(true)}>
            <RiEditLine size={25} />
          </button>
        </div>
      </div>

      {showEditPopup && (
        <EditPopup
          id={id}
          name={foodName}
          availability={foodAvailability}
          onClose={() => setShowEditPopup(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default FoodItem;