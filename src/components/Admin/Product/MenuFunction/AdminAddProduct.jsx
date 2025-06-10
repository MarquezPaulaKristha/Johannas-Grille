import React, { useState } from 'react';
import { menu_list } from '../../../../assets/assets';
import './AdminAddProduct.css';

const Menu = ({ category, setCategory }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null);

  const [selectedBranch, setSelectedBranch] = useState('');
  const [branchQuantity, setBranchQuantity] = useState('');
  const [inventory, setInventory] = useState([]);

  const availability = "Available";
  const branches = ['Batangas', 'Bauan'];
  const categories = ["Appetizer", "Must", "House", "Party", "Dessert", "Drink", "Add"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const finalInventory = selectedBranch && branchQuantity
      ? [{ branch: selectedBranch, quantity: branchQuantity }]
      : [];

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('category', selectedCategory);
    formData.append('availability', availability);
    formData.append('image', image);
    formData.append('inventory', JSON.stringify(finalInventory));

    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/menuitems', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('New menu item added:', result);
        setShowPopup(false);
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

  const filteredItems = selectedCategory
    ? menu_list.filter(item => item.category === selectedCategory)
    : menu_list;

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
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="file"
                className="admin-popup-input"
                onChange={handleImageChange}
                required
              />

              <h3>Inventory (Single Branch Only)</h3>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setBranchQuantity('');
                }}
                className="admin-popup-input"
              >
                <option value="">Select Branch</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>

              {selectedBranch && (
                <input
                  type="number"
                  placeholder="Enter quantity for selected branch"
                  className="admin-popup-input"
                  value={branchQuantity}
                  onChange={(e) => setBranchQuantity(e.target.value)}
                  required
                />
              )}

              <div className="admin-popup-actions">
                <button type="submit" className="admin-popup-button submit">Submit</button>
                <button
                  type="button"
                  className="admin-popup-button cancel"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
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

export default Menu;
