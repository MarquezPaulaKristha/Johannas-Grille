import { MdOutlineMenu } from "react-icons/md";
import "./OrderDataRange.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../Dashboard/context/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, endOfDay } from "date-fns"; // Import endOfDay to make the end date inclusive
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
    const { startDate, endDate } = item.selection;
    // Ensure the end date is inclusive by setting the time to the end of the day
    const inclusiveEndDate = endOfDay(endDate);
    const updatedRange = { ...item.selection, endDate: inclusiveEndDate };
    setState([updatedRange]);
    onDateRangeChange(updatedRange);
  };

  const onDateRangeChange = (range) => {
    setDateRange([range]);
    setIsDateAvailable(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={state}
            showMonthAndYearPickers={false}
          />
        </div>
      </div>
    </section>
  );
};

export default OrderDataRange;