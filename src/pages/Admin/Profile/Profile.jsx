import React from 'react';
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import AdminProfile from "../../../components/Admin/Profile/AdminProfile/AdminProfile"
import "./Profile.css";

const ProfileEmployee = () => {

    return (
        <main>
            <Sidebar />
            <div className="admin-profile-content-wrapper">
                <AdminProfile />
            </div>
        </main>
    );
};

export default ProfileEmployee;
