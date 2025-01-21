import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import "./Customer.css";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import EditModal from '../../../components/Admin/Customer/EditCustomer'; // Correct import
import DeleteCustomerPopup from '../../../components/Admin/Customer/DeleteCustomer';

const CustomerList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomer] = useState([]);
  const [customer, setCustomers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://johannas-grille.onrender.com/api/menuitems'); // Adjust this to your API URL
      const data = await response.json();
      setCustomers(data); // Update state with fetched data
      window.location.reload();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCustomer = () => {
    fetch("https://johannas-grille.onrender.com/api/customer")
      .then((response) => response.json())
      .then((data) => setCustomer(data))
      .catch((error) => console.error("Error fetching customer data:", error));
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer.customerid);  // Set the selected customer ID
    setShowDeletePopup(true);                  // Open the delete popup
  };

  const handleClosePopup = () => {
    setIsEditModalOpen(false);
    setShowDeletePopup(false);
  };

  const handleUpdate = () => {
    fetchCustomer(); // Refresh the customers list
  };

  const handleEditClick = (customer) => {
    console.log('Selected customer ID:', customer.customerid);
    setIsEditModalOpen(true);
    setSelectedCustomer(customer.customerid);
  };
  
  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <div>
          <h1>Customer Account</h1>
          <section className="or-content-area-table">
            <div className="or-data-table-diagram">
              <table>
                <thead>
                  <tr>
                    <th>CustomerID</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Address</th>
                    <th>PhoneNumber</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers?.map((customer) => (
                    <tr key={customer.customerid}>
                      <td>{customer.customerid}</td>
                      <td>{customer.firstname}</td>
                      <td>{customer.lastname}</td>
                      <td>{customer.address}</td>
                      <td>{customer.phonenumber}</td>
                      <td>{customer.email}</td>
                      <td className="or-dt-cell-action">
                        <div className="edit-delete-container">
                          <div className="edit-btn">
                            <button className="item-btn-cart" onClick={() => handleEditClick(customer)}>
                              <RiEditLine size={25} />
                            </button>
                            <button className="item-btn-cart" onClick={() => handleDeleteClick(customer)}>
                              <MdDeleteOutline size={25} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {isEditModalOpen && selectedCustomer && (
          <EditModal customerID={selectedCustomer} onClose={handleClosePopup} onSave={handleUpdate} />
        )}

        {showDeletePopup && selectedCustomer && (
          <DeleteCustomerPopup customerID={selectedCustomer} onClose={handleClosePopup} onDelete={fetchCustomer} />
        )}
      </div>
    </main>
  );
};

export default CustomerList;
