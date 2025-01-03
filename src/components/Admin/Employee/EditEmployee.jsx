import React, { useState, useEffect } from "react";
import './EditEmployee.css';
import { RxAvatar } from 'react-icons/rx'; // Default avatar icon

const EditModal = ({ employeeId, onClose, onSave }) => {
  const [UpdatedempfName, setUpdatedfName] = useState('');
  const [UpdatedemplName, setUpdatedlName] = useState('');
  const [Updatedemail, setUpdatedEmail] = useState('');
  const [Updatedusername, setUpdatedUsername] = useState('');
  const [UpdatedselectedBranch, setUpdatedSelectedBranch] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null); // File to upload
  const [imagePreview, setImagePreview] = useState(''); // Image URL preview

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`);
        if (response.ok) {
          const data = await response.json();
          setUpdatedfName(data.firstname);
          setUpdatedlName(data.lastname);
          setUpdatedEmail(data.email);
          setUpdatedUsername(data.username);
          setUpdatedSelectedBranch(data.branch);
          setImagePreview(data.image_url ? `http://localhost:3000${data.image_url}` : ''); // If image exists
        } else {
          console.error('Error fetching employee:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstname', UpdatedempfName);
    formData.append('lastname', UpdatedemplName);
    formData.append('email', Updatedemail);
    formData.append('username', Updatedusername);
    formData.append('branch', UpdatedselectedBranch);
    if (updatedImage) {
      formData.append('image', updatedImage);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        onSave(updatedEmployee); // Pass updated employee back to parent
        onClose(); // Close the modal
      } else {
        console.error('Error updating employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Handle image change
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
    <div className="edit-emplo-popup-form">
      <div className="edit-emplo-content">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSave}>
          <div className="edit-form-left-emp">
            <label htmlFor="image">Upload Image</label>
            {imagePreview ? (
              <div className="edit-emplo-image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            ) : (
              <RxAvatar className="edit-emplo-image-preview" size={100} /> // Default avatar icon
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              className="emplo-popup-input-image"
              onChange={handleImageChange}
            />
            <div className="edit-emplo-container">
              <div className="form-group1">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="edit-emplo-info-input"
                  value={UpdatedempfName}
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
                  className="edit-emplo-info-input"
                  value={UpdatedemplName}
                  onChange={(e) => setUpdatedlName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="edit-form-right-emp">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="edit-emplo-info-input"
              value={Updatedusername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="edit-emplo-info-input"
              value={Updatedemail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              required
            />
            <label htmlFor="branch">Branch</label>
            <input
              type="text"
              id="branch"
              name="branch"
              className="edit-emplo-info-input"
              value={UpdatedselectedBranch}
              onChange={(e) => setUpdatedSelectedBranch(e.target.value)}
              required
            />
            <div className="edit-button-emp">
              <button className="edit-emplo-popup-button" type="submit">Save Changes</button>
              <button className="edit-emplo-popup-button cancel" type="button" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
