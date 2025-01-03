import AreaCard from "./AreaCard";
import "./AreaCards.css";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#FA5A7D"]}
        percentFillValue={80}
        cardInfo={{
          title: "Todays Sales",
          value: "1.4K",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#FF947A"]}
        percentFillValue={50}
        cardInfo={{
          title: "Total Order",
          value: "8.2K",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#3CD856"]}
        percentFillValue={40}
        cardInfo={{
          title: "Product Sold",
          value: "18.2K",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#BF83FF"]}
        percentFillValue={40}
        cardInfo={{
          title: "New Customers",
          value: "8.2K",
        }}
      />
    </section>
  );
};

export default AreaCards;
