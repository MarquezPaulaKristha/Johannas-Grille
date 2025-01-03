import React from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import './OrderHistory.css';
import OrderHistory from '../../../components/Employee/OrderHistory/OrderHistory';

const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <OrderHistory />
      </div>
    </div>
  );
}

export default App;