import { createContext, useContext, useState } from 'react';
import usePersistState from '../hook/usePersistState'; 

const Context = createContext();

export function Provider({ children }) {
  const [orderItems, setOrderItems] = usePersistState('cart', []);
  const [cartItems, setCartItems] = usePersistState('item', []);
  const [customer, setCustomer] = usePersistState('customer', null);
  const [foodList, setFoodList] = useState([]);
  const [customername, setcustomername] = usePersistState('table', '');
  const [orderType, setOrderType] = usePersistState('order', 'Dine In');
  const [selectedBranch, setSelectedBranch] = usePersistState('customer_branch');
  const [selectedEmployeeBranch, setSelectedEmployeeBranch] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pickupDate, setPickupDate] = usePersistState(
    'date',
    new Date().toISOString().substring(0, 10)
  );
  const [pickupHour, setPickupHour] = usePersistState('hour', "12:00");
  const [reserveItems, setReserveItems] = usePersistState('reserve', []);
  const [reservationDetails, setReservationDetails] = usePersistState('details', null);
  const [payloadDetails, setPayloadDetails] = usePersistState('payload', []); 


  return (
    <Context.Provider value={{ orderItems, setOrderItems, foodList, setFoodList, 
    customername, setcustomername, orderType, setOrderType, customer, setCustomer, 
    selectedBranch, setSelectedBranch, cartItems, setCartItems, branch, setBranch, 
    pickupDate, setPickupDate, pickupHour, setPickupHour, reserveItems, setReserveItems, 
    reservationDetails, setReservationDetails, selectedEmployeeBranch, 
    setSelectedEmployeeBranch, payloadDetails, setPayloadDetails }}>
      {children}
    </Context.Provider>
  );
}

export function useProvider() {
  return useContext(Context);
}