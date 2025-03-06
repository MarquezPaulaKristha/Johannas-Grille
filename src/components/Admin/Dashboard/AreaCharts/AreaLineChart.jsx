import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AreaLineChart = ({ month, year, setMonth, setYear, showInterpretation, branches = [] }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interpretations, setInterpretations] = useState([]);
  const [branch, setBranch] = useState(''); // State for branch filter

  const formatHourToAMPM = (hour) => {
    if (hour === 0) return '12 AM'; // Midnight
    if (hour === 12) return '12 PM'; // Noon
    if (hour < 12) return `${hour} AM`; // Morning
    return `${hour - 12} PM`; // Afternoon/Evening
  };

  // Fetch prediction data from the backend
  const fetchPredictionData = async () => {
    if (!month || !year) {
      console.error('Month and year are required');
      setError('Month and year are required');
      setLoading(false);
      return;
    }
  
    try {
      console.log(`AreaLineChart - Fetching data for month: ${month}, year: ${year}, branch: ${branch}`);
      const response = await axios.get(
        `https://johannas-grille.onrender.com/api/predict?month=${month}&year=${year}&branch=${branch}`
      );
      const predictions = response.data.predictions;
  
      // Group data by day of the week and calculate average peak hours
      const groupedData = predictions.reduce((acc, entry) => {
        const date = new Date(entry.ds);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }); // e.g., "Monday"
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { total: 0, count: 0 };
        }
        acc[dayOfWeek].total += entry.peak_hour;
        acc[dayOfWeek].count += 1;
        return acc;
      }, {});
  
      // Calculate average peak hours for each day of the week
      const labels = Object.keys(groupedData);
      const data = labels.map((day) => (groupedData[day].total / groupedData[day].count).toFixed(2));
  
      // Generate interpretations for each day
      const interpretations = labels.map((day, index) => {
        const averagePeakHour = data[index];
        const formattedTime = formatHourToAMPM(Math.round(averagePeakHour)); // Convert to AM/PM format
        return {
          day,
          averagePeakHour: formattedTime,
        };
      });
  
      // Set chart data
      setChartData({
        labels,
        datasets: [
          {
            label: 'Average Peak Hours',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
          },
        ],
      });
  
      // Set interpretations
      setInterpretations(interpretations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError('Failed to fetch prediction data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictionData();
  }, [month, year, branch]); // Re-fetch data when month, year, or branch changes

  // Set default month to previous month on component mount
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const currentYear = currentDate.getFullYear();

    let defaultMonth = currentMonth - 1;
    let defaultYear = currentYear;

    if (defaultMonth === 0) {
      defaultMonth = 12;
      defaultYear -= 1;
    }

    setMonth(defaultMonth);
    setYear(defaultYear);
  }, [setMonth, setYear]);

  // Handler for filter changes that ensures parent state is updated
  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value);
    console.log(`AreaLineChart - Month changed to: ${newMonth}`);
    setMonth(newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    console.log(`AreaLineChart - Year changed to: ${newYear}`);
    setYear(newYear);
  };

  const handleBranchChange = (e) => {
    const newBranch = e.target.value;
    console.log(`AreaLineChart - Selected Branch changed to: ${newBranch}`);
    setBranch(newBranch);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
  const currentYear = currentDate.getFullYear();

  return (
    <div style={{ margin: '0 auto' }}>
      <h2>Average Peak Hours per Week</h2>

      {/* Filters for Line Chart in a Single Row */}
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="lineChartMonth">Month:</label>
          <select
            id="lineChartMonth"
            value={month}
            onChange={handleMonthChange}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {Array.from(
              { length: 12 },
              (_, i) => i + 1
            ).filter(m => !(year === currentYear && m >= currentMonth)).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="lineChartYear">Year:</label>
          <select
            id="lineChartYear"
            value={year}
            onChange={handleYearChange}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="lineChartBranch">Branch:</label>
          <select
            id="lineChartBranch"
            value={branch}
            onChange={handleBranchChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="">All Branches</option>
            {branches.length > 0 ? (
              branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))
            ) : (
              <option disabled>Loading branches...</option>
            )}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                  title: {
                    display: true,
                    text: 'Average Peak Hours per Week',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw} (Average Peak Hour)`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Average Peak Hours (0-23)' },
                  },
                  x: {
                    title: { display: true, text: 'Day of the Week' },
                  },
                },
              }}
            />

            {/* Conditionally render interpretations */}
            {showInterpretation && (
              <div style={{ width: '480px', marginTop: '-65px' }}>
                <h3>Interpretations:</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Day of the Week</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Average Peak Hour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interpretations.map((interpretation, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{interpretation.day}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{interpretation.averagePeakHour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AreaLineChart;