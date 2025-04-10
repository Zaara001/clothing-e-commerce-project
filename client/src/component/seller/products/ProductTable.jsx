import React from "react";
import ProductRow from "./ProductRow";

const dummyProducts = [
  {
    id: "#063231",
    name: "Pink Dress",
    price: "$100.00",
    size: "Medium",
    quantity: 115,
    date: "21/2/2025 at 11:35 PM",
    status: "Available",
    image: "https://via.placeholder.com/40", // Replace with actual image URLs
  },
  {
    id: "#021241",
    name: "Yellow Dress",
    price: "$90.00",
    size: "Medium",
    quantity: 0,
    date: "14/2/2025 at 10:00 PM",
    status: "Out of Stock",
    image: "https://via.placeholder.com/40",
  },
  // Add more dummy data as needed
];

const ProductTable = () => {
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-300 text-black">
            <th className="py-2 px-2"><input type="checkbox" /></th>
            <th className="py-2 px-2">Product</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Size</th>
            <th className="py-2 px-2">QTY</th>
            <th className="py-2 px-2">Date</th>
            <th className="py-2 px-2">Status</th>
            <th className="py-2 px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyProducts.map((product, index) => (
            <ProductRow key={index} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
