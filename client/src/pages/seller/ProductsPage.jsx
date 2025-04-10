import React from "react";
import Topbar from "../../component/seller/products/Topbar";
import Tabs from "../../component/seller/products/Tabs";
import ProductTable from "../../component/seller/products/ProductTable";

const MyProducts = () => {
  return (
    <div className="ml-64 p-6"> {/* Sidebar width is 64 = 16rem */}
      <Topbar />
      <Tabs />
      <ProductTable />
    </div>
  );
};

export default MyProducts;
