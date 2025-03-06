import React from "react";
import ProductCard from "../common/ProductCard";
import { products } from "../../data/Constants"; // Import product data

const LatestArrivals = () => {
  return (
    <section className="py-10 bg-gray-100">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl italic text-gray-600">NEW</h2>
        <h1 className="text-3xl font-semibold text-customBrown">ARRIVALS</h1>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
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
