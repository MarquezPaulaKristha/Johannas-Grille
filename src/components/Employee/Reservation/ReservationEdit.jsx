import React from "react";
import { MdDeleteOutline } from "react-icons/md"; // Delete Icon
import { RiEditLine } from "react-icons/ri"; // Edit Icon
import { AiOutlineExport } from "react-icons/ai";
import "./ReservationEdit.css";


const OrderAction = ({ onOpen, onEdit, onDelete }) => {
  return (
    <div className="action-buttons">
      <button className="open-btn" onClick={onOpen}>
        <AiOutlineExport size={24} />
      </button>
      {/* <button className="edit-btn" onClick={onEdit}>
        <RiEditLine size={24} />
      </button>
      <button className="delete-btn" onClick={onDelete}>
        <MdDeleteOutline size={24} />
      </button> */}
    </div>
  );
};

export default OrderAction;