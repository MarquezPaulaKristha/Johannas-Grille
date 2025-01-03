import React from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import Reservation from '../../../components/Employee/Reservation/Reservation';

const App = () => {
  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <Reservation />
      </div>
    </div>
  );
}

export default App;