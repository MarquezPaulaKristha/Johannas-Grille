import { MdOutlineMenu } from "react-icons/md";
import "./OrderDataRange.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../Dashboard/context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

const OrderDataRange = ({ dateRange, setDateRange, setIsDateAvailable }) => {
  const { openSidebar } = useContext(SidebarContext);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  const handleDateChange = (item) => {
    setState([item.selection]);
    onDateRangeChange(item.selection);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="content-area-top">
      {/* <div className="content-area">
        <Header />
      </div> */}
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">Latest Orders</h2>
      </div>
      <div className="area-top-r">
        <div
          ref={dateRangeRef}
          className={`date-range-wrapper ${
            !showDatePicker ? "hide-date-range" : ""
          }`}
          onClick={handleInputClick}
        >
          <DateRange
            editableDateInputs={true}
            onChange={(item) => (setDateRange([item.selection]), setIsDateAvailable(true))}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            showMonthAndYearPickers={false}
          />
        </div>
      </div>
    </section>
  );
};

export default OrderDataRange;
