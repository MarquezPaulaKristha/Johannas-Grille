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

const AreaLineChart = ({ month, setMonth, year, setYear, startDate, setStartDate, endDate, setEndDate }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branch, setBranch] = useState('Batangas'); // Default branch
  const [branches, setBranches] = useState(['Bauan', 'Batangas']); // Only Bauan and Batangas

  const fetchPredictionData = async (start, end, selectedBranch) => {
    try {
      const response = await axios.get(`https://johannas-grille.onrender.com/api/predict`, {
        params: {
          start_date: start,
          end_date: end,
          month: month,
          year: year,
          branch: selectedBranch, // Pass the selected branch to the API
        },
      });
      return response.data.predictions;
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError('Failed to fetch prediction data. Please try again later.');
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      const predictions = await fetchPredictionData(startDate, endDate, branch);

      if (predictions) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const labels = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
          labels.push(currentDate.getDate());
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const data = labels.map((day) => {
          const prediction = predictions.find((entry) => new Date(entry.ds).getDate() === day);
          return prediction ? prediction.peak_hour : null;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Predicted Peak Hour',
              data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
              pointRadius: labels.map((day) => (day === new Date().getDate() ? 6 : 3)),
            },
          ],
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate, month, year, branch]); // Add branch to the dependency array

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>Peak Hours Analytics</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        {/* Branch Filter */}
        <label htmlFor="branch">Branch:</label>
        <select
          id="branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        >
          {branches.map((branchOption) => (
            <option key={branchOption} value={branchOption}>
              {branchOption}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        />

        {/* End Date */}
        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '5px', fontSize: '16px' }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              title: {
                display: true,
                text: 'Predicted Peak Hour Per Day',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} (Peak Hour)`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: false, // Disable starting at zero
                min: 7, // Start the y-axis at 7
                title: { display: true, text: 'Peak Hours (7-23)' },
              },
              x: {
                title: { display: true, text: 'Days' },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default AreaLineChart;