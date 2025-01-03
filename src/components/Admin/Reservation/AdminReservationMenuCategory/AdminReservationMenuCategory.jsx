import React, { useState } from "react";
import "./AdminReservationMenuCategory.css"; // Assuming you have a CSS file
import { res_list } from '../../../../assets/assets';

const AdminReservationMenuCategory = ({ category, setCategory }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null);

  const availability = "Available";

  const categories = ["Appetizer", "Main Course", "Dessert", "Drink"]; // Adjust according to your items

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('category', selectedCategory);
    formData.append('availability', availability);
    formData.append('image', image); // Attach image file

    try {
      // Send form data to backend API
      const response = await fetch('http://localhost:3000/api/menuitems', {
        method: 'POST',
        body: formData, // Send form data as body
      });

      if (response.ok) {
        const result = await response.json(); // Parse the result
        console.log('New menu item added:', result);

        // Close the popup after successful submission
        setShowPopup(false);

        // Refresh the menu
        window.location.reload();
      } else {
        console.error('Error adding menu item:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Filter menu items based on selected category
  const filteredItems = selectedCategory
    ? res_list.filter(item => item.category === selectedCategory)
    : res_list;

  return (
    <div className="admin-product-menu">
      <h1>Product</h1>

      <button className="admin-add-product-button" onClick={() => setShowPopup(true)}>
        Add Products
      </button>

      {showPopup && (
        <div className="admin-popup-form">
          <div className="admin-popup-content">
            <h2>Add New Product</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Enter product name and portion"
                className="admin-popup-input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Enter product price"
                className="admin-popup-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-popup-input"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                type="file"
                className="admin-popup-input"
                onChange={handleImageChange}
                required
              />

              <div className="admin-popup-actions">
                <button type="submit" className="admin-popup-button submit">Submit</button>
                <button type="button" className="admin-popup-button cancel" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-product-menu-list">
        {filteredItems.map((item, index) => (
          <div
            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            key={index}
            className='explore-menu-list-item'
          >
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt='' />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReservationMenuCategory;
