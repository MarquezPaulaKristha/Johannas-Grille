import React, { useState, useEffect } from "react";
import './EditCustomer.css';

const EditModal = ({ customerID, onClose, onSave }) => {
  const [UpdatedcustfName, setUpdatedfName] = useState('');
  const [UpdatedcustlName, setUpdatedlName] = useState('');
  const [Updatedaddress, setUpdatedAddress] = useState('');
  const [Updatedphone, setUpdatedphone] = useState('');
  const [Updatedemail, setUpdatedEmail] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null); // File to upload
  const [imagePreview, setImagePreview] = useState(''); // Image URL preview

  // Handle form input changes
  useEffect(() => {
    console.log('CustomerID:', customerID); // Check the customerID
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://johannas-grille.onrender.com/api/customer/${customerID}`);
        if (response.ok) {
          const data = await response.json();
          setUpdatedfName(data.firstname);
          setUpdatedlName(data.lastname);
          setUpdatedAddress(data.address);
          setUpdatedphone(data.phonenumber);
          setUpdatedEmail(data.email);
          setImagePreview(`https://johannas-grille.onrender.com${data.image_url}`);
        } else {
          console.error('Error fetching customer:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };
  
    fetchCustomer();
  }, [customerID]);  

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstname', UpdatedcustfName);
    formData.append('lastname', UpdatedcustlName);
    formData.append('address', Updatedaddress);
    formData.append('phonenumber', Updatedphone);
    formData.append('email', Updatedemail);
    if (updatedImage) {
      formData.append('image', updatedImage);
    }

    try {
      const response = await fetch(`https://johannas-grille.onrender.com/api/customer/${customerID}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        onSave(updatedCustomer); // Pass updated customer back to parent
        onClose(); // Close the popup
      } else {
        console.error('Error updating customer:', response.statusText);
      }

    } catch (error) {
      console.error('Error updating customer:', error);
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
    <div className="edit-customer-popup-form">
      <div className="edit-customer-content">
        <h2>Edit Customer</h2>
        <form onSubmit={handleSave}>
          <div className="edit-form-left-cust">
            <label>Upload Image</label>
            {imagePreview && (
              <div className="edit-customer-image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <input id="image" type="file" accept="image/*" onChange={handleImageChange}/>

            <div className="edit-customer-container">
              <div className="form-group1">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="edit-customer-info-input"
                  value={UpdatedcustfName}
                  onChange={(e) => setUpdatedfName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group1">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  className="edit-customer-info-input"
                  value={UpdatedcustlName}
                  onChange={(e) => setUpdatedlName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="edit-form-right-cust">
            <label htmlFor="username">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="edit-customer-info-input"
              value={Updatedaddress}
              onChange={(e) => setUpdatedAddress(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="edit-customer-info-input"
              value={Updatedemail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              required
            />
            <label htmlFor="branch">Phone Number</label>
            <input
              type="text"
              id="phonenumber"
              name="phonenumber"
              className="edit-customer-info-input"
              value={Updatedphone}
              onChange={(e) => setUpdatedphone(e.target.value)}
              required
            />
            <div>
              <button className="edit-customer-popup-button" type="submit">Save Changes</button>
              <button className="edit-customer-popup-button cancel" type="button" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
