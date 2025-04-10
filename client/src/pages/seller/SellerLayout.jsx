import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "../../component/seller/SellerSidebar"; // make sure this exists

const SellerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
