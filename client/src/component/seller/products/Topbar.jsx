import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/seller/products/add"); // 👈 Route to Add Product page
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-4">
      <div className="flex items-center w-full md:w-1/3 bg-gray-100 px-3 py-2 rounded-md">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search for id, name product"
          className="ml-2 bg-transparent outline-none w-full text-sm"
        />
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button className="border border-black px-4 py-2 rounded text-sm hover:bg-black hover:text-white">
          Filter
        </button>
        <button className="border border-black px-4 py-2 rounded text-sm hover:bg-black hover:text-white">
          Export
        </button>
        <button
          onClick={handleAddProduct}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
        >
          + New Product
        </button>
      </div>
    </div>
  );
};

export default Topbar;
