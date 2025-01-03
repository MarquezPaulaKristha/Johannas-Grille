import React from 'react';  
import { useContext, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { assets } from '../../../assets/assets'

  import {
    MdOutlineBarChart,
    MdOutlineClose,
    MdOutlineCurrencyExchange,
    MdOutlineGridView,
    MdOutlineLogout,
    MdOutlinePeople,
    MdOutlineSettings,
    MdOutlineShoppingBag,
  } from "react-icons/md";
  import { CgProfile } from "react-icons/cg";

import "./Sidebar.css";
import { SidebarContext } from "../Dashboard/context/SidebarContext";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation();  // Use location to get the current path

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;  // Function to check active path

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
        <img src={assets.logo} />
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/admin/dashboard" className={`menu-link ${isActive("/admin/dashboard") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/order" className={`menu-link ${isActive("/admin/order") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={20} />
                </span>
                <span className="menu-link-text">Order History</span>
              </Link>
            </li>
            {/* <li className="menu-item">
              <Link to="/admin/inventory" className={`menu-link ${isActive("/admin/inventory") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <CgProfile size={18} />
                </span>
                <span className="menu-link-text">Inventory</span>
              </Link>
            </li> */}
            <li className="menu-item">
              <Link to="/admin/inventory" className={`menu-link ${isActive("/admin/inventory") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <CgProfile size={18} />
                </span>
                <span className="menu-link-text">Inventory</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/reservationmenu" className={`menu-link ${isActive("/admin/reservationmenu") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Reservation</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/product" className={`menu-link ${isActive("/admin/product") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Products</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/customer" className={`menu-link ${isActive("/admin/customer") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Customer</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/employeelist" className={`menu-link ${isActive("/admin/employeelist") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <CgProfile size={18} />
                </span>
                <span className="menu-link-text">Employee</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/admin/profile" className={`menu-link ${isActive("/admin/profile") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <CgProfile size={18} />
                </span>
                <span className="menu-link-text">Profile</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-menu em-sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <div className="menu-link">
                <span className="menu-link-text">Branch: Batangas City</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;