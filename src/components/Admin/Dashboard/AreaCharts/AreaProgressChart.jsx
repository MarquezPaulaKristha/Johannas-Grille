import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreaProgressChart = ({ month, year, branches }) => {
  const [topMenu, setTopMenu] = useState([]);
  const [error, setError] = useState(null);
  const [branch, setBranch] = useState(''); // State for branch filter

  // Fetch top menu items from the backend
  const fetchTopMenu = async () => {
    try {
      const response = await axios.get(
        `https://johannas-grille.onrender.com/api/top-items?month=${month}&year=${year}&branch=${branch}`
      );
      if (response.status === 200) {
        setTopMenu(response.data);
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error fetching top menu items:", error.message);
      setError("Failed to fetch top menu items. Please try again later.");
    }
  };

  // Re-fetch data when month, year, or branch changes
  useEffect(() => {
    fetchTopMenu();
  }, [month, year, branch]);

  // Handler for branch filter change
  const handleBranchChange = (e) => {
    const newBranch = e.target.value;
    console.log(`AreaProgressChart - Branch changed to: ${newBranch}`);
    setBranch(newBranch);
  };

  return (
    <div className="progress-bar">
      {/* Progress Chart Content */}
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Most Sold Menu</h4>

        {/* Branch Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <label htmlFor="progressChartBranch">Branch:</label>
          <select
            id="progressChartBranch"
            value={branch}
            onChange={handleBranchChange}
            style={{ padding: '5px', fontSize: '16px' }}
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

      {/* Display Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Progress Bar List */}
      <div className="progress-bar-list">
        {topMenu?.map((progressbar) => {
          const percent = Math.min(progressbar.percentvalues, 100);
          return (
            <div className="progress-bar-item" key={progressbar.menuitemid}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">{progressbar.name}</p>
                <p className="bar-item-info-value">
                  {progressbar.percentvalues}
                </p>
              </div>
              <div className="bar-item-full">
                <div
                  className="bar-item-filled"
                  style={{
                    width: `${percent}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AreaProgressChart;