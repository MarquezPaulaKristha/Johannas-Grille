import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Admin/Sidebar/Sidebar";
import "./Inventory.css";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

const TABLE_HEADS = [
  "MenuItemID",
  "Name",
  "Quantity",
  "ConsumedOfBranch",
  "EndingInventory",
  "Remarks",
  "Date",
  "Action",
];

const InventoryLogs = () => {

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("https://johannas-grille.onrender.com/api/inventory");
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);
  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <div>
          <h1>Inventory</h1>
          <section className="or-content-area-table">
            <div className="or-data-table-diagram">
            <table>
                <thead>
                  <tr>
                    {TABLE_HEADS?.map((th, index) => (
                      <th key={index}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory?.map((dataItem) => (
                    <tr key={dataItem.id}>
                    
                      <td>{dataItem.menuitid}</td>
                      <td>{dataItem.name}</td>
                      <td>{dataItem.quantity}</td>
                      <td>{dataItem.cob}</td>
                      <td>{dataItem.endinv}</td>
                      <td>{dataItem.remarks}</td>
                      <td>{dataItem.date}</td>
                      <td className="or-dt-cell-action">
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
    </main>
  );
};

export default InventoryLogs;