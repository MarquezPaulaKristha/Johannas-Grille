import React from "react";
import Sidebar from "../../../components/Employee/Sidebar/Sidebar";
import Header from "../../../components/Employee/Header/Header";
import OrderList from "../../../components/Employee/Dashboard/OrderList/OrderList";
import { useProvider } from "../../../global_variable/Provider";
import "./Dashboard.css";

const App = () => {
  const { branch } = useProvider(); // Get branch from context

  return (
    <div>
      <Sidebar />
      <div className="em-main-content">
        <Header />
        <OrderList branch={branch} /> {/* Pass branch to OrderList */}
      </div>
    </div>
  );
};

export default App;
