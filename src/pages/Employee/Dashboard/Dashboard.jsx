import React from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import OrderList from '../../../components/Employee/Dashboard/OrderList/OrderList';
import './Dashboard.css';

const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <OrderList />
      </div>
    </div>
  );
}

export default App;
