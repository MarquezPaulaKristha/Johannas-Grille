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

const AreaLineChart = ({ month, year, setMonth, setYear, showInterpretation }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interpretations, setInterpretations] = useState([]); // Store interpretations per day

  // Fetch prediction data from the backend
  const fetchPredictionData = async () => {
    try {
      const response = await axios.get(
        `https://johannas-grille.onrender.com/api/predict?month=${month}&year=${year}`
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
        let interpretation = '';

        if (averagePeakHour >= 18) {
          interpretation = `On ${day}, the peak hours are in the evening (${averagePeakHour} hrs). This indicates high customer traffic after work hours.`;
        } else if (averagePeakHour >= 12) {
          interpretation = `On ${day}, the peak hours are in the afternoon (${averagePeakHour} hrs). This suggests a busy lunchtime or midday rush.`;
        } else {
          interpretation = `On ${day}, the peak hours are in the morning (${averagePeakHour} hrs). This indicates early customer activity.`;
        }

        return interpretation;
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
      setError('Failed to fetch prediction data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictionData();
  }, [month, year]); // Re-fetch data when month or year changes

  return (
    <div style={{ margin: '0 auto' }}>
      <h2>Average Peak Hours per Week</h2>

      {/* Filters for Line Chart in a Single Row */}
      <div style={{ 
        marginBottom: '20px', 
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
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="lineChartYear">Year:</label>
          <select
            id="lineChartYear"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
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
              <div style={{ width: '480px', marginTop: '-120px' }}>
                <h3>Interpretations:</h3>
                <ul>
                  {interpretations.map((interpretation, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      {interpretation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AreaLineChart;