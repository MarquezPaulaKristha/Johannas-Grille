import React from 'react';
import { assets } from '../../../assets/assets'
import { Link } from "react-router-dom";
import './Sidebar.css'
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
} from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";
import { PiDiceFiveLight } from "react-icons/pi";
import { BsGraphUp } from "react-icons/bs";

const isActive = (path) => location.pathname === path;

const Sidebar = () => {
  return (
    <aside className="em-sidebar">
      <div className="em-logo">
        <img src={assets.logo} />
      </div>
      <nav className='em-contents'>
        <div className="em-sidebar-menu">
          <ul className="em-menu-list">
            <li className="em-menu-item">
              <Link to="/employee/dashboard" className={`em-menu-link ${isActive("/employee/dashboard") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="em-menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/reservation" className={`em-menu-link ${isActive("/employee/reservation") ? "active" : ""}`}>
                <span className="menu-link-icon">
                  <MdOutlineAttachMoney size={20} />
                </span>
                <span className="menu-link-text">Reservation</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/order" className={`em-menu-link ${isActive("/employee/order") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <PiDiceFiveLight size={18} />
                </span>
                <span className="em-menu-link-text">Orders</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/orderhistory" className={`em-menu-link ${isActive("/employee/orderhistory") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <AiOutlineHistory size={20} />
                </span>
                <span className="em-menu-link-text">Order History</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/statistics" className={`em-menu-link ${isActive("/employee/statistics") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <BsGraphUp size={20} />
                </span>
                <span className="em-menu-link-text">Statistics</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/product" className={`em-menu-link ${isActive("/employee/product") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <PiDiceFiveLight size={18} />
                </span>
                <span className="em-menu-link-text">Product</span>
              </Link>
            </li>
            <li className="em-menu-item">
              <Link to="/employee/profile" className={`em-menu-link ${isActive("/employee/profile") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <PiDiceFiveLight size={18} />
                </span>
                <span className="em-menu-link-text">Profile</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-menu em-sidebar-menu2">
          <ul className="em-menu-list">
            <li className="em-menu-item">
              <Link to="#" className={`em-menu-link ${isActive("/logout") ? "active" : ""}`}>
                <span className="em-menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="em-menu-link-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
