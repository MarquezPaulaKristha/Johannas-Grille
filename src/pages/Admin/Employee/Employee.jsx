import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import AddModal from "../../../components/Admin/Employee/AddEmployee";
import EditModal from "../../../components/Admin/Employee/EditEmployee";
import DeleteModal from "../../../components/Admin/Employee/DeleteEmployee";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import "./Employee.css";

const TABLE_HEADS = [
  "UserID",
  "UserType",
  "FirstName",
  "LastName",
  "Email",
  "Branch",
  "Action",
];

const EmployeeList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = () => {
    fetch("https://johannas-grille.onrender.com/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employee data:", error));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setIsEditModalOpen(true);
    setSelectedEmployee(employee.userid);  // Pass the employee's ID here
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee.userid);  // Set the selected employee ID correctly
    setShowDeletePopup(true);              // Open the delete popup
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setShowDeletePopup(false);  // Close the delete popup
  };

  const handleDeleteEmployee = () => {
    fetchEmployees(); // Refresh the employees list after deletion
  };

  const handleSaveNewEmployee = (formData) => {
    fetch("https://johannas-grille.onrender.com/api/employeeadd", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setEmployees((prev) => [...prev, data]);
        handleCloseModal();
      })
      .catch((error) => console.error("Error adding employee:", error));
  };

  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <div>
          <div className="emp-header-container">
            <button className="admin-add-product-button" onClick={handleAddClick}>
              Add Employee
            </button>
            <h1>Employee Account</h1>
          </div>
          <section className="emplo-content-area-table">
            <div className="emplo-data-table-diagram">
              <table>
                <thead>
                  <tr>
                    {TABLE_HEADS.map((th, index) => (
                      <th key={index}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.userid}>
                      <td>{employee.userid}</td>
                      <td>{employee.usertype}</td>
                      <td>{employee.firstname}</td>
                      <td>{employee.lastname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.branch}</td>
                      <td className="emplo-dt-cell-action">
                        <i onClick={() => handleEditClick(employee)}>
                          <RiEditLine size={25} />
                        </i>
                        <i onClick={() => handleDeleteClick(employee)}>
                          <MdDeleteOutline size={25} />
                        </i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {isEditModalOpen && selectedEmployee && (
          <EditModal
            employeeId={selectedEmployee}  // Pass employeeId properly
            onClose={handleCloseModal}
            onSave={fetchEmployees}
          />
        )}

        {isAddModalOpen && (
          <AddModal
            onClose={handleCloseModal}
            onSave={handleSaveNewEmployee} // Pass the save handler
          />
        )}

        {showDeletePopup && selectedEmployee && (
          <DeleteModal
            employeeId={selectedEmployee} 
            onClose={handleCloseModal} 
            onDelete={handleDeleteEmployee} // Call the delete handler here
          />
        )}

      </div>
    </main>
  );
};

export default EmployeeList;
