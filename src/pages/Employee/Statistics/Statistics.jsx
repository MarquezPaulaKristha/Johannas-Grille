import React from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import AreaCharts from '../../../components/Employee/Statistics/areaCharts/AreaCharts'
import './Statistics.css';

const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <AreaCharts/>
      </div>
    </div>
  );
}

export default App;