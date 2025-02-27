import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreaProgressChart = () => {
  const [topMenu, setTopMenu] = useState([]);
  const [error, setError] = useState(null); // State to store errors
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month

  const fetchTopMenu = async () => {
    try {
      const response = await axios.get(
        `https://johannas-grille.onrender.com/api/top-items?month=${month}&year=${year}`
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

  useEffect(() => {
    fetchTopMenu();
  }, [month, year]); // Refetch data when month or year changes

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value, 10));
  };

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Most Sold Menu</h4>
        {/* Year and Month Filters in one row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <label htmlFor="year">Year:</label>
          <select id="year" value={year} onChange={handleYearChange}>
            {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <label htmlFor="month">Month:</label>
          <select id="month" value={month} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>
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