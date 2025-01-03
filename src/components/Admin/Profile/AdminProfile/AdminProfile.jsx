import React, { useEffect, useState } from 'react';
import { RxAvatar } from "react-icons/rx";
import AdminUpdatePopup from "../AdminUpdatePopup/AdminUpdatePopup"; // Import the popup component
import "./AdminProfile.css";

const AdminProfile = () => {
  const [image, setImage] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [usertype, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Popup state

  useEffect(() => {
    const storedImage = sessionStorage.getItem('image');
    console.log('Image URL:', storedImage); // Log the image URL for debugging

    // Prepend base URL if necessary
    const baseURL = 'http://localhost:3000';
    setImage(storedImage ? `${baseURL}${storedImage}` : '');
    setFirstname(sessionStorage.getItem('firstname'));
    setLastname(sessionStorage.getItem('lastname'));
    setEmail(sessionStorage.getItem('email'));
    setUserType(sessionStorage.getItem('usertype'));
    setUsername(sessionStorage.getItem('username'));
  }, []);

  const handleUpdateClick = () => {
    setShowPopup(true); // Show the popup
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <main>
      <div className="admin-profile-wrapper">
        <div className="admin-profile-header">
          <h1>Profile</h1>
        </div>

        <div className="admin-profile-content">
          <div className="admin-profile-info">
            <div className="admin-avatar-box">
              {image ? (
                <img src={image} alt="Profile" className="admin-avatar-img" />
              ) : (
                <RxAvatar className="admin-avatar" size={100} />
              )}
            </div>
            <h2>{firstname} {lastname}</h2>
            <div className="admin-personal-info">
              <p>{usertype}</p>
            </div>
          </div>

          <div className="admin-profile-form">
            <h3>Account Settings</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="first-name">First Name</label>
                <input
                  type="text"
                  id="first-name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="last-name">Last Name</label>
                <input
                  type="text"
                  id="last-name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button className="admin-update-btn" onClick={handleUpdateClick}>Update</button>
          </div>
        </div>
      </div>

      {/* Render the UpdateProfile component */}
      <AdminUpdatePopup
        showPopup={showPopup}
        handleClose={handleClosePopup}
        firstname={firstname}
        lastname={lastname}
        username={username}
        email={email}
        image={image} // Pass the current image to the popup
        setFirstname={setFirstname}
        setLastname={setLastname}
        setUsername={setUsername}
        setEmail={setEmail}
        setImage={setImage} // Allow updating the image
      />
    </main>
  );
};

export default AdminProfile;