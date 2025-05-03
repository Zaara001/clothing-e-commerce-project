import React, { useState, useEffect } from "react";
import { ShoppingCart, FavoriteBorder } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCartAsync } from "../../redux/cartSlice";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const [hover, setHover] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Set default size and color when product loads
  useEffect(() => {
    if (product) {
      if (product.sizeOptions?.length > 0) {
        setSelectedSize('M');
      }
      if (product.colorOptions?.length > 0) {
        setSelectedColor(product.colorOptions[0]);
      }
    }
  }, [product]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (!selectedColor || !selectedSize) {
      alert("Please select both color and size before adding to the cart.");
      return;
    }

    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          cartAction: true,
          product: product,
          selectedSize,
          selectedColor
        },
      });
    } else {
      dispatch(addItemToCartAsync({ 
        productId: product._id, 
        quantity: 1,
        selectedColor,
        selectedSize
      }));
      navigate("/cart");
    }
  };

  if (!product || !product.images?.length) {
    return <div className="bg-white p-4 rounded-lg shadow-xl w-64 h-96 flex items-center justify-center">
      <p>No product available</p>
    </div>;
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {'★'.repeat(fullStars)}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  
  return (
    <Link to={`/product/${product._id}`} className="block">
 <div
  className={`bg-white p-4 w-56 h-[420px] rounded-md shadow-xl relative overflow-hidden 
  transition-all duration-300 transform-gpu will-change-transform
  ${hover ? 
    "scale-105 shadow-2xl cursor-pointer z-10" : 
    "scale-100 cursor-default"
  }`}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
        <div className="w-full h-64 rounded-md overflow-hidden mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`object-cover w-full h-full transition duration-300 ${
              hover ? "brightness-75 scale-100" : ""
            }`}
          />
        </div>

        {/* Content */}
        {product.brandName && (
            <p className="text-sm pl-2 pb-1 font-semibold text-gray-500 line-clamp-1">
              {product.brandName}
            </p>
          )}

        <div className="px-2 space-y-1">
          <h3 className="font-bold text-gray-700 text-lg line-clamp-1">
            {product.name}
          </h3>
          
          {product.totalRatings > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">
                {renderStars(product.averageRating)}
              </span>
              <span className="text-gray-500 text-xs">
                ({product.totalRatings})
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-black">
              Rs. {product.price}
            </p>
            {product.originalPrice && (
              <span className="text-gray-400 text-base font line-through">
                Rs. {product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-600  py-1 rounded-full text-sm font-semibold">
                {product.discount}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        {hover && (
          <div className="absolute top-1/2 right-4 flex flex-col gap-3 transform -translate-y-1/2">
            <button
              onClick={handleAddToCart}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-300 transition-all"
              disabled={loading}
            >
              <ShoppingCart style={{ width: "24px", height: "24px" }} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};


export default ProductCard;