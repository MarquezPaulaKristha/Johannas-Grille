import React, { useState } from "react";
import AreaTop from "../../../components/Admin/Dashboard/AreaTop/AreaTop";
import AreaCards from "../../../components/Admin/Dashboard/AreaCards/AreaCards";
import AreaCharts from "../../../components/Admin/Dashboard/AreaCharts/AreaCharts";
import Header from "../../../components/Admin/Header/Header";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", component: <> <AreaTop /> <AreaCards /> <AreaCharts/> </> },
    { name: "Cards", component: <AreaCards /> },
    { name: "Charts", component: <AreaCharts /> },
  ];

  return (
    <main>
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        
        {/* Tabs Navigation */}
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={activeTab === tab.name ? "active-tab" : ""}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabs.find((tab) => tab.name === activeTab)?.component}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
