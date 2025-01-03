import React from 'react';
import Sidebar from "../../../components/Employee/Sidebar/Sidebar";
import EmployeeProfile from "../../../components/Employee/Profile/EmployeeProfile/EmployeeProfile"
import "./Profile.css";

const ProfileEmployee = () => {

    return (
        <main>
            <Sidebar />
            <div className="employee-profile-content-wrapper">
                <EmployeeProfile />
            </div>
        </main>
    );
};

export default ProfileEmployee;
