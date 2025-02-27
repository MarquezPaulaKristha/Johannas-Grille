import React, { useState, useEffect } from "react";
import AreaTop from "../../../components/Admin/Dashboard/AreaTop/AreaTop";
import AreaCards from "../../../components/Admin/Dashboard/AreaCards/AreaCards";
import AreaCharts from "../../../components/Admin/Dashboard/AreaCharts/AreaCharts";
import Header from "../../../components/Admin/Header/Header";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import './Dashboard.css';

const Dashboard = () => {

  return (
    <main>
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        <AreaTop />
        <AreaCharts />
      </div>
    </main>
  );
};

export default Dashboard;
