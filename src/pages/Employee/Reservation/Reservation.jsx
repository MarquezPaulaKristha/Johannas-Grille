import React from 'react';
import Sidebar from '../../../components/Employee/Sidebar/Sidebar';
import Header from '../../../components/Employee/Header/Header';
import Reservation from '../../../components/Employee/Reservation/Reservation';
import { useProvider } from "../../../global_variable/Provider";

const App = () => {
  const { branch } = useProvider();
  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <Reservation branch={branch}/>
      </div>
    </div>
  );
}

export default App;