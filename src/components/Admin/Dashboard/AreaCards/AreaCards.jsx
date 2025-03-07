import React, { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.css";
import axios from "axios";

const AreaCards = ({ month, year, branch }) => {
  const [salesData, setSalesData] = useState({
    todaySales: 0,
    totalOrders: 0,
    productsSold: 0,
  });

  useEffect(() => {
    console.log(`Fetching data for month: ${month}, year: ${year}, branch: ${branch}`); // Debug log
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://johannas-grille.onrender.com/api/sales-data",
          {
            params: { month, year, branch },
          }
        );
        console.log("Fetched data:", response.data); // Debug log
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, [month, year, branch]); // Ensure month, year, and branch are in the dependency array

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#FA5A7D"]}
        percentFillValue={80}
        cardInfo={{
          title: "Today's Sales",
          value: `${salesData.todaySales}`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#FF947A"]}
        percentFillValue={50}
        cardInfo={{
          title: "Total Orders",
          value: `${salesData.totalOrders}`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#3CD856"]}
        percentFillValue={40}
        cardInfo={{
          title: "Products Sold",
          value: `${salesData.productsSold}`,
        }}
      />
    </section>
  );
};

export default AreaCards;