import React from "react";
import ProductCard from "../common/ProductCard";
import { products } from "../../data/Constants"; // Import product data

const LatestArrivals = () => {
  return (
    <section className="py-10 bg-gray-100 w-[1100px] mx-auto absolute top-[1930px] left-0 right-0">
      {/* Title */}
      <div className="text-center mb-8 ">
        <h2 className="text-xl italic text-gray-600">NEW</h2>
        <h1 className="text-3xl font-semibold text-customBrown">ARRIVALS</h1>
      </div>

      {/* Product Grid */}
      <div className=" flex flex-row flex-wrap mx-auto  w-[900px] px-6 relative gap-4 justify-center">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
          {products.slice(0, 4).map((product, index) => (
          <ProductCard key={index} product={product} />
         
        ))}
      </div>
    </section>
  );
};

export default LatestArrivals;
