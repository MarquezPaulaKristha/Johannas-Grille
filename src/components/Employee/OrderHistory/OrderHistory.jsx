import React from 'react'
import "./OrderHistory.css";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

const TABLE_HEADS = ["Products", "Order ID", "Date", "Customer name", "Status", "Amount", "Action"];
const TABLE_DATA = [
  { id: 100, name: "Iphone 13 Pro", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "delivered", amount: 400 },
  { id: 101, name: "Macbook Pro", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "pending", amount: 288 },
  { id: 102, name: "Apple Watch", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "canceled", amount: 500 },
  { id: 103, name: "Microsoft Book", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "delivered", amount: 100 },
  { id: 104, name: "Apple Pen", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "delivered", amount: 60 },
  { id: 105, name: "Airpods", order_id: 11232, date: "Jun 29,2022", customer: "Afaq Karim", status: "delivered", amount: 80 },
];

const OrderHistory = () => {
  return (
      <div className="order-main-content">
        <div>
          <h1>Orders Page</h1>
          <section className="order-content-area-table">
            <div className="order-data-table-info">
              <h1 className="order-data-table-title">Latest Orders</h1>
            </div>
            <div className="order-data-table-diagram">
              <table>
                <thead>
                  <tr>
                    {TABLE_HEADS?.map((th, index) => (
                      <th key={index}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_DATA?.map((dataItem) => (
                    <tr key={dataItem.id}>
                      <td>{dataItem.name}</td>
                      <td>{dataItem.order_id}</td>
                      <td>{dataItem.date}</td>
                      <td>{dataItem.customer}</td>
                      <td>
                        <div className="order-dt-status">
                          <span className={`order-dt-status-dot dot-${dataItem.status}`}></span>
                          <span className="order-dt-status-text">{dataItem.status}</span>
                        </div>
                      </td>
                      <td>${dataItem.amount.toFixed(2)}</td>
                      <td className="order-dt-cell-action">
                        <div className="edit-delete-container">
                          <div className="edit-btn">
                            <button className="item-btn-cart">
                              <RiEditLine size={25} />
                            </button>
                            <button className="item-btn-cart">
                              <MdDeleteOutline size={25} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
  );
};

export default OrderHistory;