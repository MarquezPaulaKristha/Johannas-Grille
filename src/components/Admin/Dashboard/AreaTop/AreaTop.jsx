import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.css";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title"> </h2>
      </div>
    </section>
  );
};

export default AreaTop;
