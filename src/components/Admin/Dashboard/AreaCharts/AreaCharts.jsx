import React, { useState } from 'react';
import AreaLineChart from "./AreaLineChart"
import AreaProgressChart from "./AreaProgressChart"

const AreaCharts = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <section className="content-area-charts">
      <AreaLineChart month={month} setMonth={setMonth} />
      <AreaProgressChart month={month} />
    </section>
  )
}

export default AreaCharts