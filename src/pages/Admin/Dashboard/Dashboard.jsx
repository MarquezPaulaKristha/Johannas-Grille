import React, { useState, useEffect } from "react";
import axios from "axios";
import AreaTop from "../../../components/Admin/Dashboard/AreaTop/AreaTop";
import AreaCards from "../../../components/Admin/Dashboard/AreaCards/AreaCards";
import AreaCharts from "../../../components/Admin/Dashboard/AreaCharts/AreaCharts";
import Header from "../../../components/Admin/Header/Header";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import "./Dashboard.css";
import AreaLineChart from "../../../components/Admin/Dashboard/AreaCharts/AreaLineChart";
import AreaProgressChart from "../../../components/Admin/Dashboard/AreaCharts/AreaProgressChart";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [chartMonth, setChartMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [chartYear, setChartYear] = useState(new Date().getFullYear()); // Default to current year
  const [progressChartMonth, setProgressChartMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [progressChartYear, setProgressChartYear] = useState(new Date().getFullYear()); // Default to current year
  const [branches, setBranches] = useState([]); // Initialize as an empty array
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch

  // Fetch branches from the backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("https://johannas-grille.onrender.com/api/branches");
        if (response.data && Array.isArray(response.data)) {
          setBranches(response.data); // Set branches to the fetched data
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  console.log("Dashboard - chartMonth:", chartMonth, "chartYear:", chartYear); // Debug log

  const tabs = [
    {
      name: "Overview",
      component: (
        <>
          <AreaTop />
          <AreaCards
            key={`${chartMonth}-${chartYear}`} // Force re-render
            month={chartMonth}
            year={chartYear}
          />
          <AreaCharts />
        </>
      ),
    },
    {
      name: "Cards",
      component: (
        <>
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              borderTop: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <h3>Progress Chart Filters</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="progressChartMonth">Select Month:</label>
              <select
                id="progressChartMonth"
                value={progressChartMonth}
                onChange={(e) => setProgressChartMonth(Number(e.target.value))}
                style={{ padding: "5px", fontSize: "16px" }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="progressChartYear">Select Year:</label>
              <select
                id="progressChartYear"
                value={progressChartYear}
                onChange={(e) => setProgressChartYear(Number(e.target.value))}
                style={{ padding: "5px", fontSize: "16px" }}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="progressChartBranch">Select Branch:</label>
              <select
                id="progressChartBranch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{ padding: "5px", fontSize: "16px" }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AreaCards
            key={`${progressChartMonth}-${progressChartYear}-${selectedBranch}`} // Force re-render
            month={progressChartMonth}
            year={progressChartYear}
            branch={selectedBranch} // Pass selected branch to AreaCards
          />
          <AreaProgressChart
            month={progressChartMonth}
            year={progressChartYear}
            branch={selectedBranch} // Pass selected branch to AreaProgressChart
          />
        </>
      ),
    },
    {
      name: "Charts",
      component: (
        <div style={{ width: "700px" }}>
          <AreaLineChart
            month={chartMonth}
            year={chartYear}
            setMonth={setChartMonth} // Pass setMonth
            setYear={setChartYear} // Pass setYear
            showInterpretation={true}
            branches={branches} // Pass branches to AreaLineChart
          />
        </div>
      ),
    },
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