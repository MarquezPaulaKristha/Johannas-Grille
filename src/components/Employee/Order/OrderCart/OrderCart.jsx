import React, { useState, useEffect } from 'react';
import OrderItem from '../OrderItem';
import PlaceOrderPopup from '../PlaceOrderPopup/PlaceOrderPopup';
import './OrderCart.css';
import { useProvider } from '../../../../global_variable/Provider';
import GCashOrderPopup from '../GCashOrderPopup/GCashOrderPopup';
import { TbBrandGoogleMaps } from "react-icons/tb";

const OrderCart = ({ category, setCategory, orderId, branch }) => {
  const { orderItems, setOrderItems, orderType, setOrderType, setBranch } = useProvider();
  const [showPlaceOrderPopup, setShowPlaceOrderPopup] = useState(false);
  const [gcashOrderPopup, setGCashOrderPopup] = useState(false);

  // Set employee branch on component mount
  useEffect(() => {
    if (branch) {
      setBranch(branch);
    }
  }, [branch, setBranch]);


  return (
    <div className="em-product-menu">
      <h1 className="menu-title">Product Menu</h1>
      <div className="em-ordercart">
        <h2>Cart</h2>
        <section className="addtocart-branch">
          <i className="location-icon">
            <TbBrandGoogleMaps size={31} />
          </i>
          <h6>Branch: {branch}</h6>
        </section>
        <div className="order-id">
          <h6>Order ID: {orderId}</h6>
        </div>
        <div className="order-type">
          <label>
            <input
              type="radio"
              name="orderType"
              value="Dine In"
              checked={orderType === 'Dine In'}
              onChange={(e) => setOrderType(e.target.value)}
            />
            Dine In
          </label>
          <label>
            <input
              type="radio"
              name="orderType"
              value="Takeout"
              checked={orderType === 'Takeout'}
              onChange={(e) => setOrderType(e.target.value)}
            />
            Takeout
          </label>
        </div>
        <div>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <OrderItem
                key={item.menuitemid}
                item={item}
                increaseQuantity={() => setOrderItems((prev) =>
                  prev.map((i) => i.menuitemid === item.menuitemid
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                  )
                )}
                decreaseQuantity={() => setOrderItems((prev) =>
                  prev.map((i) => i.menuitemid === item.menuitemid
                    ? { ...i, quantity: i.quantity === 1 ? 1 : i.quantity - 1 }
                    : i
                  )
                )}
              />
            ))
          ) : (
            <div>No items in your order.</div>
          )}
        </div>
        <div className="em-order-buttons">
          <div className="em-order-placeorder">
            <button onClick={() => setShowPlaceOrderPopup(true)} disabled={orderItems.length === 0}>Cash</button>
          </div>
          <div className="em-order-placeorder">
            <button onClick={() => setGCashOrderPopup(true)} disabled={orderItems.length === 0}>G-Cash</button>
          </div>
        </div>
      </div>
      {showPlaceOrderPopup && (
        <PlaceOrderPopup onCancel={() => setShowPlaceOrderPopup(false)} branch={branch} />
      )}
      {gcashOrderPopup && (
        <GCashOrderPopup orderItems={orderItems} orderType={orderType} branch={branch} onCancel={() => setGCashOrderPopup(false)} />
      )}
    </div>
  );
};

export default OrderCart;
