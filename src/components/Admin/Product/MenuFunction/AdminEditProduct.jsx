import React, { useState, useEffect } from 'react';
import './AdminEditProduct.css';

const EditPopup = ({ productId, onClose, onSave }) => {
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null); // File to upload
  const [imagePreview, setImagePreview] = useState(''); // Image URL preview
  const [categories, setCategories] = useState([]); // Categories from DB

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`https://johannas-grille.onrender.com/api/menuitems/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setUpdatedName(data.name);
          setUpdatedPrice(data.price);
          setUpdatedCategory(data.category);
          setImagePreview(`https://johannas-grille.onrender.com${data.image_url}`);
        } else {
          console.error('Error fetching menu item:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching menu item:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://johannas-grille.onrender.com/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Error fetching categories:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchMenuItem();
    fetchCategories();
  }, [productId]);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', updatedName);
    formData.append('price', updatedPrice);
    formData.append('category', updatedCategory);
    if (updatedImage) {
      formData.append('image', updatedImage);
    }

    try {
      const response = await fetch(`https://johannas-grille.onrender.com/api/menuitems/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSave(updatedProduct); // Pass updated product back to parent
        onClose(); // Close the popup
      } else {
        console.error('Error updating menu item:', response.statusText);
      }

    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-popup">
      <div className="edit-popup-inner">
        <h2>Edit Menu Item</h2>
        <div className="edit-popup-content">
          <div className="edit-popup-left">
            <label>Upload Image</label>
            <div className="image-preview">
              <img src={imagePreview || '/placeholder.png'} alt="Preview" />
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="edit-popup-right">
            <label>Product Name</label>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />

            <label>Price</label>
            <input
              type="number"
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(e.target.value)}
            />

            <label>Category</label>
            <select
              value={updatedCategory}
              onChange={(e) => setUpdatedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>

            <div className="edit-popup-buttons">
              <button type="submit" className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
