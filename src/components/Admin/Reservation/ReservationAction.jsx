// TRANSACTIONACTION.JSX;
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { VscEdit } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";

const ReservationEdit = (Transaction) => {


    const [editData, setEditData] = useState(null);

    const handleEditClick = (dataItem) => {
        setEditData(dataItem);
    };

    const handleClosePopup = () => {
        setEditData(null);
    };

    return (
        <main className="page-wrapper">
            <Sidebar />
            <div className="content-wrapper">
                <h1>Reservation Page</h1>
                <section className="or-content-area-table">
                    <div className="or-data-table-info">
                        <h1 className="or-data-table-title">Lists</h1>
                    </div>
                    <div className="or-data-table-diagram">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Branch</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_DATA?.map((dataItem) => (
                                    <tr key={dataItem.id}>
                                        <td>{dataItem.name}</td>
                                        <td>{dataItem.phone}</td>
                                        <td>{dataItem.branch}</td>
                                        <td>{dataItem.date}</td>
                                        <td>{dataItem.time}</td>
                                        <td>{dataItem.amount}</td>
                                        <td>
                                            <div className="or-dt-status">
                                                <span className={`or-dt-status-dot dot-${dataItem.status}`}></span>
                                                <span className="or-dt-status-text">{dataItem.status}</span>
                                            </div>
                                        </td>
                                        <td className="or-dt-cell-action">
                                            <i onClick={() => handleEditClick(dataItem)}>
                                                < VscEdit />
                                            </i>
                                            <i>
                                                < MdDeleteOutline />
                                            </i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default TransactionEdit;