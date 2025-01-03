import React, { useState } from 'react';
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Customer/Home/Home';
import Cart from './pages/Customer/ItemPopup/ItemPopup';
import AddToCart from './pages/Customer/Product/Cart';
import LoginPopUp from './pages/Customer/Login/Login';
import ConfirmOrder from './pages/Customer/Receipt/Receipt';
import ProfileCustomer from './pages/Customer/CustomerProfile/CustomerInfo'
import Admin_LoginPopUp from './pages/Admin/Login/Login';
import Order from './pages/Admin/Orders/Order'
import ReservationMenu from './pages/Admin/Reservation/Reservation'
import BaseLayout from './pages/Admin/Dashboard/Dashboard';
import EmployeeList from './pages/Admin/Employee/Employee';
import Reservation from './pages/Employee/Reservation/Reservation'
import Product from './pages/Admin/Product/Product';
import CustomerList from './pages/Admin/Customer/Customer'
import Employee_Dashboard from './pages/Employee/Dashboard/Dashboard';
import OrderHistory from './pages/Employee/OrderHistory/OrderHistory'
import Statistics from './pages/Employee/Statistics/Statistics'
import ProductList from './pages/Employee/Product/Product'
import ProfileAdmin from './pages/Admin/Profile/Profile';
import ProtectedRoute from './components/Admin/PrivateRoute';
// import Inventory from './pages/Admin/Inventory/Inventory';
import Inventory from './pages/Admin/Inventory/Inventory'
import ProfileEmployee from './pages/Employee/Profile/Profile';
import EmployeeOrder from './pages/Employee/Order/Order';
import { Provider } from './global_variable/provider';
import SuccessPage from './pages/Employee/Success/Success';
import SuccessCustomerPage from './pages/Customer/Success/success';
import SuccessReservationPage from './pages/Customer/Success/SuccessReservation';
const App = () => {
  return (
    <>
      <div className='app'>
        <Provider>
          <Routes>
            <Route path='/' element={<Home/> } />
            <Route path='/cart' element={ <Cart /> } />
            <Route path='/add-to-cart' element={ <AddToCart /> } />
            <Route path='/login' element={ <LoginPopUp /> } />
            <Route path='/confirm' element={ <ConfirmOrder /> } />
            <Route path='/customerinfo' element={ <ProfileCustomer /> } />
            <Route path='/admin/login' element={ <Admin_LoginPopUp />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute> <BaseLayout /> </ProtectedRoute> } />
            <Route path='/admin/order' element={<ProtectedRoute> <Order /> </ProtectedRoute>} />
            <Route path='/admin/reservationmenu' element={<ProtectedRoute> <ReservationMenu/> </ProtectedRoute>} />
            <Route path='/admin/product' element={<ProtectedRoute> <Product /> </ProtectedRoute>} />
            <Route path='/admin/employeelist' element={<ProtectedRoute> <EmployeeList /> </ProtectedRoute>} />
            <Route path='/admin/profile' element={<ProtectedRoute> <ProfileAdmin /> </ProtectedRoute>} />
            <Route path='/admin/customer' element={<ProtectedRoute> <CustomerList /> </ProtectedRoute>} />
            {/* <Route path='/admin/inventory' element={<ProtectedRoute> <Inventory /> </ProtectedRoute>} /> */}
            <Route path='/admin/inventory' element={<ProtectedRoute> <Inventory /> </ProtectedRoute>} />
            <Route path='/employee/dashboard' element={<ProtectedRoute> <Employee_Dashboard /> </ProtectedRoute>} />
            <Route path='/employee/orderhistory' element={<ProtectedRoute> <OrderHistory /> </ProtectedRoute>} />
            <Route path='/employee/statistics' element={<ProtectedRoute> <Statistics /> </ProtectedRoute>} />
            <Route path='/employee/product' element={<ProtectedRoute> <ProductList /> </ProtectedRoute>} />
            <Route path='/employee/order' element={<ProtectedRoute> <EmployeeOrder /> </ProtectedRoute>} />
            <Route path='/employee/reservation' element={<ProtectedRoute> <Reservation /> </ProtectedRoute>} />
            <Route path='/employee/profile' element={<ProtectedRoute> <ProfileEmployee /> </ProtectedRoute>} />
            <Route path='/employee/success' element={<ProtectedRoute> <SuccessPage /> </ProtectedRoute>} />
            <Route path='/success' element={<ProtectedRoute> <SuccessCustomerPage /> </ProtectedRoute>} />
            <Route path='/success-reservation' element={<ProtectedRoute> <SuccessReservationPage /> </ProtectedRoute>} />
          </Routes>
        </Provider>
      </div>
    </>
  );
};

export default App;