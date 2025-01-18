import React from 'react'
import Customerinfo from '../../../components/Customer/CustomerProfile/CustomerInfo/CustomerInfo'
import CustomerTransaction from '../../../components/Customer/CustomerProfile/CustomerTransaction/CustomerTransaction'

const CustomerProfile = () => {
    return (
        <>
            <div>
                <Customerinfo/>
                <CustomerTransaction/>
            </div>
        </>
    );
};

export default CustomerProfile
