import React, { useState } from "react";
import { ShoppingCart, FavoriteBorder } from "@mui/icons-material";

const ProductCard = ({ product }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-white p-3 shadow-lg rounded-lg relative overflow-hidden transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-[250px] object-cover rounded-lg"
      />

      {/* Rating (Hidden on Hover) */}
      {!hover && (
        <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-sm">
          4.4 ★ | 10
        </div>
      )}

      {/* Hover Icons */}
      {hover && (
        <div className="absolute top-1/2 right-4 flex flex-col gap-3 transform -translate-y-1/2">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
            <ShoppingCart fontSize="small" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
            <FavoriteBorder fontSize="small" />
          </button>
        </div>
      )}

      {/* Product Details */}
      <h3 className="mt-2 font-bold">{product.title}</h3>
      <p className="text-lg font-semibold text-green-600">
        Rs. {product.price}{" "}
        <span className="text-gray-400 text-sm line-through">
          Rs. {product.oldPrice}
        </span>
      </p>
      <p className="text-green-500 text-sm">{product.discount} off</p>
    </div>
  );
};

export default ProductCard;
