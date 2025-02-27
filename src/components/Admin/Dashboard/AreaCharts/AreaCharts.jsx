import React, { useState } from 'react';
import AreaLineChart from "./AreaLineChart";
import AreaProgressChart from "./AreaProgressChart";
import AreaCards from "../AreaCards/AreaCards";

const AreaCharts = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(`${year}-${String(month).padStart(2, '0')}-01`);
  const [endDate, setEndDate] = useState(`${year}-${String(month).padStart(2, '0')}-25`);

  return (
    <section >
      <div className="content-areacards">
        <AreaCards startDate={startDate} endDate={endDate} />
      </div>
      <div className="content-area-charts">
        <AreaLineChart month={month} setMonth={setMonth} year={year} setYear={setYear} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
        <AreaProgressChart month={month} year={year} />
      </div>
    </section>
  )
}

export default AreaCharts;