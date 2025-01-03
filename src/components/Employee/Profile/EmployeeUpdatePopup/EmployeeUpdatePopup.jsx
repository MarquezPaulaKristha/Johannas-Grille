import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import the profile icon from React Icons
import './EmployeeUpdatePopup.css';

const EmployeeUpdatePopup = ({
  showPopup, handleClose, firstname, lastname, username, email, image,
  setFirstname, setLastname, setUsername, setEmail, setImage
}) => {
  const [imagePreview, setImagePreview] = useState(image);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Updated:', { firstname, lastname, username, email, image });
    handleClose(); // Close the popup after saving
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview the image before upload
        setImage(reader.result); // Set the image in state
      };
      reader.readAsDataURL(file);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="employee-popup-overlay">
      <div className="employee-popup-content">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="employee-popup-details-content">
            <div className="employee-profile-popup-left">
              {/* Profile Image */}
              <label htmlFor="popup-image">Profile Image</label>
              <div className="employee-image-and-input">
                <div className="employee-image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" />
                  ) : (
                    <FaUserCircle size={100} color="#ccc" /> // Display the icon when no image is set
                  )}
                </div>
              </div>
              <input
                type="file"
                id="popup-image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="employee-edit-name-details">
                {/* First Name */}
              <div className="employee-form-group">
                <label htmlFor="popup-firstname">First Name</label>
                <input
                  type="text"
                  id="popup-firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              {/* Last Name */}
              <div className="employee-form-group">
                <label htmlFor="popup-lastname">Last Name</label>
                <input
                  type="text"
                  id="popup-lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              </div>
            </div>
            <div className="employee-profile-popup-right">
              {/* Username */}
              <div className="employee-form-group">
                <label htmlFor="popup-username">Username</label>
                <input
                  type="text"
                  id="popup-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="employee-form-group">
                <label htmlFor="popup-email">Email Address</label>
                <input
                  type="email"
                  id="popup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="employee-popup-buttons">
                <button type="submit" className="employee-popup-update-btn">Save</button>
                <button type="button" className="employee-popup-close-btn" onClick={handleClose}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeUpdatePopup;
