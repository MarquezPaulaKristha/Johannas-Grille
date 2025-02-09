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

  const fetchCustomer = () => {
    fetch("https://johannas-grille.onrender.com/api/customer")
      .then((response) => response.json())
      .then((data) => {
        // Filter and sort customers where customerid >= 1000
        const sortedData = data.filter((customer) => customer.customerid >= 1000)
          .sort((a, b) => a.customerid - b.customerid); // Sort by customerid in ascending order
        setCustomer(sortedData);
      })
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
