import React from "react";

const TABLE_HEADS = [
  "OrderID",
  "CustomerID",
  "OrderType",
  "Date",
  "Status",
  "Total Amount",
  "Time",
];

const OrderTable = ({ orders }) => {
  // Sorting orders by date and time in descending order (most recent first)
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateB - dateA; // Sort by date first (descending)
    }

    // Convert time to minutes for correct sorting
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes; // Convert to total minutes
    };

    return timeToMinutes(b.time) - timeToMinutes(a.time); // Sort by time (descending)
  });

  return (
    <div className="or-data-table-diagram">
      <table>
        <thead>
          <tr>
            {TABLE_HEADS.map((th, index) => (
              <th key={index}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((dataItem) => {
            const formattedDate = new Date(dataItem.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const formattedTime = new Date(`1970-01-01T${dataItem.time}`).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <tr key={dataItem.orderid}>
                <td>{dataItem.orderid.slice(-5)}</td>
                <td>{dataItem.customerid}</td>
                <td>{dataItem.ordertype}</td>
                <td>{formattedDate}</td>
                <td>
                  <div className="or-dt-status">
                    <span className={`or-dt-status-dot dot-${dataItem.status}`}></span>
                    <span className="or-dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>P{dataItem.totalamount}</td>
                <td>{formattedTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
