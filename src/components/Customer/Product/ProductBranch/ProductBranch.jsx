import React from "react";
import { TbBrandGoogleMaps } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "./ProductBranch.css";

const ProductBranch = ({ selectedBranch, isDropdownOpen, toggleDropdown, selectBranch }) => {
  return (
    <section className="addtocart-branch">
      <i className="location-icon">
        <TbBrandGoogleMaps size={31} />
      </i>
      <span>{selectedBranch}</span>
      <i className="down-icon" onClick={toggleDropdown}>
        {isDropdownOpen ? <IoIosArrowUp size={28} /> : <IoIosArrowDown size={28} />}
      </i>
      {isDropdownOpen && (
        <div className="branch-dropdown">
          <p onClick={() => selectBranch("Main Branch, Bauan Batangas City")}>
            Main Branch, Bauan Batangas City
          </p>
          <p onClick={() => selectBranch("Branch 2: Batangas City")}>
            Branch 2: Batangas City
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductBranch;
