import React, { useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";
import axiosInstance from "../../utils/axiosInstance";

const LatestArrivals = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/api/product/latest"); // Adjust if your backend URL is different
        setLatestProducts(data);
      } catch (error) {
        console.error("Failed to fetch latest products:", error);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="relative top--10">
      <div className="flex flex-col items-center justify-center mb-6">
       <h2 className="text-xl italic text-gray-600">NEW</h2>
      <h1 className="text-3xl font-semibold text-customBrown">ARRIVALS</h1>
      </div>
    <div className="py-10 bg-[#C9A38D] w-[1190px] mx-auto relative left-0 right-0">

      <div className="flex flex-row flex-wrap mx-auto w-[1100px] py-9 px-6 relative gap-4 justify-center bg-[#FCF0E9]">
        {latestProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default LatestArrivals;
