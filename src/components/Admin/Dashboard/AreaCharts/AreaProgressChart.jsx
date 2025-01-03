import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreaProgressChart = ({ month }) => {
  const [topMenu, setTopMenu] = useState([]);
  const [error, setError] = useState(null); // State to store errors

  const fetchTopMenu = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/top-items?month=${month}`);
      if (response.status === 200) {
        setTopMenu(response.data);
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error fetching top menu items:", error.message);
      setError("Failed to fetch top menu items. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTopMenu();
  }, [month]);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Most Sold Menu</h4>
      </div>
      <div className="progress-bar-list">
        {topMenu?.map((progressbar) => {
          const percent = Math.min(progressbar.percentvalues, 100)
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
          )
        })}
      </div>
    </div>
  );
};

export default AreaProgressChart;
