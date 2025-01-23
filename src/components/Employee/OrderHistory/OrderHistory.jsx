import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import "./OrderHistory.css"

const TABLE_HEADS = [
  "OrderID",
  "CustomerID",
  "OrderType",
  "Date",
  "Status",
  "Total Amount",
  "Time"
];

const OrderHistory = ({ orders, handleEdit, handleDelete }) => {
  return (
    <div className="em-data-table-diagram">
      <table>
        <thead>
          <tr>
            {TABLE_HEADS.map((th, index) => (
              <th key={index}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((dataItem) => {
            const formattedDate = new Date(dataItem.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const formattedTime = new Date(`1970-01-01T${dataItem.time}`).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <tr key={dataItem.orderid}>
                <td>{dataItem.orderid.slice(-5)}</td>
                <td>{dataItem.customerid}</td>
                <td>{dataItem.ordertype}</td>
                <td>{formattedDate}</td>
                <td>
                  <div className="em-dt-status">
                    <span className={`em-dt-status-dot dot-${dataItem.status}`}></span>
                    <span className="em-dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>P{dataItem.totalamount}</td>
                <td>{formattedTime}</td>
                {/* <td className="em-dt-cell-action">
                  <div className="edit-delete-container">
                    <button className="item-btn-cart" onClick={() => handleEdit(dataItem)}>
                      <RiEditLine size={25} />
                    </button>
                    <button className="item-btn-cart" onClick={() => handleDelete(dataItem.orderid)}>
                      <MdDeleteOutline size={25} />
                    </button>
                  </div>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
