import React, { useEffect, useState } from 'react';
import AreaCard from "./AreaCard";
import "./AreaCards.css";

const AreaCards = ({ startDate, endDate }) => {
  const [salesData, setSalesData] = useState({
    todaySales: 0,
    totalOrders: 0,
    productsSold: 0,
  });

  useEffect(() => {
    const generateRandomSalesData = () => {
      // Generate a random number of total orders
      const totalOrders = Math.floor(Math.random() * 100000) + 4000; // Random orders between 2000 and 12000

      // Calculate today's sales as a multiple of total orders
      const todaySales = Math.floor(totalOrders * 2.5); // Sales are 1.5 times the total orders

      // Calculate products sold as a multiple of total orders
      const productsSold = Math.floor(totalOrders * .6); // Each order results in 4.5 products sold on average

      setSalesData({
        todaySales,
        totalOrders,
        productsSold,
      });
    };

    generateRandomSalesData();
  }, [startDate, endDate]);

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