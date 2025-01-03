// import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../../components";
import React, { useState } from 'react'
import ItemDisplay from "../../../components/Employee/Product/ItemDisplay/ItemDisplay";
import Menu from "../../../components/Employee/Product/Menu/Menu";
import Sidebar from "../../../components/Employee/Sidebar/Sidebar";
import Header from '../../../components/Employee/Header/Header'
import './Product.css'

const ProductList = () => {
    const [category, setCategory] = useState("All");

    return (
        <main >
            <Sidebar />
            {/* right side/content of the page */}
            <div className="product-content-wrapper">
                <Header />
                <Menu category={category} setCategory={setCategory} />
                <ItemDisplay category={category} />
            </div>
        </main>
    );
};

export default ProductList;
