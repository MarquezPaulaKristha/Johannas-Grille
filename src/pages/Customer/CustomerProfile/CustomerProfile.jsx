import React from 'react'
import Customerinfo from '../../../components/Customer/CustomerProfile/CustomerInfo/CustomerInfo'
import CustomerOrderTransaction from '../../../components/Customer/CustomerProfile/CustomeOrderTransaction/CustomerOrderTransaction'
import CustomerReservationTransaction from '../../../components/Customer/CustomerProfile/CustomerReservationTransaction/CustomerReservationTransaction'

const CustomerProfile = () => {
    return (
        <>
            <div>
                <Customerinfo/>
                <CustomerOrderTransaction/>
                <CustomerReservationTransaction/>
            </div>
        </>
    );
};

export default CustomerProfile
