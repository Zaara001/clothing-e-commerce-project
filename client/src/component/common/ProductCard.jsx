import React, { useState, useEffect } from "react";
import { ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductCard = () => {
  const [hover, setHover] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:3000/product/getOne");
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, []);

  if (!product) return <p>Loading product...</p>;

  return (
    <Link to={`/product/${product._id}`}>
      <div
        className={`bg-white p-3 w-[200px] shadow-lg relative overflow-hidden transition-transform duration-300 ${
          hover ? "scale-105 cursor-pointer" : "cursor-default"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-[260px] object-contain transition duration-300 ${
            hover ? "brightness-75" : ""
          }`}
        />

        {/* Rating (Hidden on Hover) */}
        {!hover && (
          <div className="absolute bottom-28 text-black bg-gray-400 font-bold px-2 py-1 text-sm">
            4.4 ★ | 10
          </div>
        )}

        {/* Hover Icons */}
        {hover && (
          <div className="absolute top-1/2 right-4 flex flex-col gap-3 transform -translate-y-1/2">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-300 transition cursor-pointer">
              <ShoppingCart fontSize="small" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-300 transition cursor-pointer">
              <FavoriteBorder fontSize="small" />
            </button>
          </div>
        )}

        {/* Product Details */}
        <h3 className="mt-2 font-bold text-gray-500">{product.name}</h3>
        <p className="text-lg font-semibold text-black">
          Rs. {product.price}{" "}
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through">
              Rs. {product.oldPrice}
            </span>
          )}
        </p>
        <p className="text-green-500 text-sm">{product.discount}% off</p>
      </div>
    </Link>
  );
};

export default ProductCard;
