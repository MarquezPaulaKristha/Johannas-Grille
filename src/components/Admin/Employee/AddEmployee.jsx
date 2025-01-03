import React, { useState } from 'react';
import './AddEmployee.css';

const AddModal = ({ onClose, onSave }) => {
    const [empfName, setfName] = useState('');
    const [emplName, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    // Default usertype
    const usertype = "Employee"; 

    const branch = ["Batangas", "Bauan"];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstname', empfName);
        formData.append('lastname', emplName);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('branch', selectedBranch);
        formData.append('image', image);
        formData.append('usertype', usertype); // Add usertype as default value

        onSave(formData); // Pass the formData back to the parent component
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="emplo-popup-form">
            <div className="emplo-popup-content">
                <h2>Add New Employee</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-left">
                        <label>Upload Image:</label>
                        {imagePreview && (
                            <div className="emplo-image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                        <input
                            type="file"
                            className="emplo-popup-input"
                            onChange={handleImageChange}
                        />
                        <div className="emplo-add-container">
                            <div className="form-group1">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="emplo-popup-input"
                                    value={empfName}
                                    onChange={(e) => setfName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group1">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="emplo-popup-input"
                                    value={emplName}
                                    onChange={(e) => setlName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="emplo-details">
                            <div className="form-group2">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    className="emplo-popup-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group2">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    className="emplo-popup-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-right">
                        <label>Email:</label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            className="emplo-popup-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Branch:</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="emplo-popup-input"
                            required
                        >
                            <option value="">Select Branch</option>
                            {branch.map((branch, index) => (
                                <option key={index} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="emplo-popup-button">Submit</button>
                        <button type="button" className="emplo-popup-button cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddModal;
