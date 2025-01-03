import React, { useState } from 'react';
import AreaLineChart from "./AreaLineChart"
import AreaProgressChart from "./AreaProgressChart"

const AreaCharts = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear()); 

  return (
    <section className="content-area-charts">
      <AreaLineChart month={month} setMonth={setMonth} year={year} setYear={setYear} />
      <AreaProgressChart month={month} year={year} />
    </section>
  )
}

export default AreaCharts