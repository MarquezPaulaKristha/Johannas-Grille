import React, { useState } from 'react';
import AreaLineChart from "./AreaLineChart";
import AreaProgressChart from "./AreaProgressChart";
import AreaCards from "../AreaCards/AreaCards";

const AreaCharts = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <section >
      {/* <div className="content-areacards">
        <AreaCards startDate={startDate} endDate={endDate} />
      </div> */}
      <div className="content-area-charts">
        <AreaLineChart month={month} setMonth={setMonth} year={year} setYear={setYear}/>
        <AreaProgressChart month={month} year={year} />
      </div>
    </section>
  )
}

export default AreaCharts;