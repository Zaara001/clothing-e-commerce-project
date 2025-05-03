import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReviewSection from "./ReviewSection";
import Header from "../common/Header";
import Footer from "../common/Footer";
import bgImage from "../../assets/images/headerBackground.png";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { addItemToCartAsync } from "../../redux/cartSlice";
import { useAuth } from "../../context/AuthContext";

const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [isShowingTrending, setIsShowingTrending] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "No ratings";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/api/product/getOne/${id}`, { withCredentials: true }),
          axios.get(`/reviews/${id}`)
        ]);

        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`/api/product/recommendations/${id}/similar`);
        setRecommendations(res.data.data || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    const fetchFrequentlyBought = async () => {
      try {
        const { data } = await axios.get(`/api/product/recommendations/${id}/frequently-bought`);

        if (data.data?.length > 0) {
          setFrequentlyBought(data.data);
          setIsShowingTrending(false); // Actual frequently bought items
        } else {
          const fallback = await axios.get('/api/product/trending');
          setFrequentlyBought(fallback.data.data || []);
          setIsShowingTrending(true); // Showing trending fallback
        }
      } catch (err) {
        console.error('Error fetching frequently bought:', err);
        const fallback = await axios.get('/api/product/trending');
        setFrequentlyBought(fallback.data.data || []);
        setIsShowingTrending(true); // Showing trending due to error
        toast.error('Could not load frequently bought items', {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };


    if (product) {
      fetchRecommendations();
      fetchFrequentlyBought();
    }
  }, [id, product]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (authLoading) return;

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
        },
      });
    } else {
      dispatch(addItemToCartAsync({
        productId: product._id,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize
      }));
      navigate("/cart");
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading product...</div>;
  if (!product) return <div className="p-10 text-center text-red-500">Product not found</div>;

  const today = new Date();
  const estimatedDelivery = new Date(today);
  estimatedDelivery.setDate(today.getDate() + 2);

  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div
        className="relative bg-cover bg-center h-[165px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Header />
      </div>

      <div className="pl-20 py-12 flex gap-20 bg-gray-100">
  {/* Image Gallery Column (Left) */}
  <div className="flex gap-6 ml-12">
    <div className="flex flex-col gap-3">
      {product.images?.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Thumb ${i}`}
          className="w-20 h-24 object-cover border rounded"
          onError={(e) => (e.target.src = "/fallback.png")}
        />
      ))}
    </div>
    <img
      src={product.images?.[0] || "/fallback.png"}
      alt="Main"
      className="w-full h-auto max-w-md object-cover rounded shadow"
      onError={(e) => (e.target.src = "/fallback.png")}
    />
  </div>

  {/* Scrollable Details Column (Right) */}
  <div className="space-y-6 flex-1 overflow-y-auto h-[calc(100vh-110px)] pr-4">
    <h2 className="text-3xl font-bold font-poppins capitalize">{product.name}</h2>

    <div className="flex items-center gap-2 text-gray-700 ">
      <span className="text-yellow-500 text-xl">{averageRating !== "No ratings" ? "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating)) : "☆ ☆ ☆ ☆ ☆"}</span>
      <span className="text-md">({reviews.length} Reviews)</span>
    </div>

    <div className="text-2xl font-bold text-black">
      Rs. {product.price}
      {product.originalPrice && (
        <>
          <span className="line-through text-gray-500 text-lg ml-2">
            Rs. {product.originalPrice}
          </span>
          <span className="text-green-700 text-lg ml-2">
            ({product.discount}% off)
          </span>
        </>
      )}
    </div>

    <div className="space-y-6">
      {/* Size and Color Selectors */}
      <div className="space-y-2">
        <p className="font-semibold text-lg text-gray-700">Select Size</p>
        <div className="flex gap-3 flex-wrap">
          {product.sizeOptions.map((size) => (
            <button
              key={size}
              className={`border border-black px-4 py-2 rounded-full uppercase ${selectedSize === size ? "bg-black text-white" : "text-black"}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-lg text-gray-700">Select Color</p>
        <div className="flex gap-3 flex-wrap">
          {product.colorOptions.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Quantity Selector */}
    <div className="flex items-center gap-4">
      <button
        className="border px-3 py-1"
        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        className="border px-3 py-1"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </button>
    </div>

    {/* Add to Cart Button */}
    <div className="flex gap-4">
      <button
        className="bg-customBrown hover:bg-black text-white font-semibold px-6 py-2 rounded"
        onClick={handleAddToCart}
      >
        ADD TO CART
      </button>
    </div>

    {/* Delivery Information */}
    <div className="mt-6">
      <h4 className="font-semibold text-xl text-gray-800">Estimated Delivery</h4>
      <p className="">
        Order today, {new Date().toLocaleDateString()} and get your product by <strong>{formattedDeliveryDate}</strong>.
      </p>
      <p className="text-gray-700 text-lg mt-2">Delivery Fee: <strong>Rs. 49</strong></p>
    </div>

    {/* Offers Section */}
    <div className="mt-4  rounded-lg">
      <h5 className="font-semibold text-lg mb-3">Available Offers (Test Mode)</h5>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          
          <span>Bank Offer: 8% Instant Discount on HDFC Credit Cards, up to ₹1,000 on orders above ₹3,999 <span className="text-blue-600 cursor-pointer">T&C</span></span>
        </div>
        <div className="flex items-start gap-2">
          
          <span>Special Deal: Get extra 25% off using code SUMMER25 <span className="text-blue-600 cursor-pointer">T&C</span></span>
        </div>
        <div className="flex items-start gap-2">
          
          <span>Bank Offer: 5% Cashback on ICICI Bank Debit Card EMI <span className="text-blue-600 cursor-pointer">T&C</span></span>
        </div>
        <div className="flex items-start gap-2">
          
          <span>New User Offer: Flat ₹200 off on first purchase <span className="text-blue-600 cursor-pointer">T&C</span></span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Note: Displayed offers are for demonstration purposes only. No actual transactions will be processed in test mode.
      </p>
    </div>
  </div>
</div>



      <div className="mt-10 px-20">
        <div className="flex space-x-10 border-b">
          <button
            className={`py-3 px-64 font-medium ${activeTab === "details" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("details")}
          >
            Product Details
          </button>
          <button
            className={`py-3 px-64 font-medium ${activeTab === "reviews" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Ratings & Reviews
          </button>
        </div>
      </div>

      <div className="px-20 py-6">
        {activeTab === "details" && (
          <div className="space-y-6 text-[17px] text-gray-800 leading-relaxed">
            <h3 className="text-2xl font-semibold text-black mb-4">Product Details</h3>
            <div className="flex flex-col gap-3 ">
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Material:</span> {product.material}</p>
              <p><span className="font-semibold">Care Instructions:</span> {product.careInstructions}</p>
              <p><span className="font-semibold">Brand:</span> {product.brandName}</p>

              {product.transparency && (
                <p><span className="font-semibold">Transparency:</span> {product.transparency}</p>
              )}

              {product.occasions?.length > 0 && (
                <p><span className="font-semibold">Occasions:</span> {product.occasions.join(', ')}</p>
              )}

              {product.countryOfOrigin && (
                <p><span className="font-semibold">Country of Origin:</span> {product.countryOfOrigin}</p>
              )}

              {product.manufactureDetails && (
                <p><span className="font-semibold">Manufacture Details:</span> {product.manufactureDetails}</p>
              )}

              {product.itemWeight && (
                <p><span className="font-semibold">Item Weight:</span> {product.itemWeight}gm</p>
              )}

              {product.fabricType && (
                <p><span className="font-semibold">Fabric Type:</span> {product.fabricType}</p>
              )}

              {product.fitType && (
                <p><span className="font-semibold">Fit Type:</span> {product.fitType}</p>
              )}

              <p className="col-span-2">
                <span className="font-semibold">Description:</span> {product.description}
              </p>
            </div>
          </div>
        )}


        {activeTab === "reviews" && (
          <ReviewSection productId={id} initialReviews={reviews} />
        )}
      </div>

      {
        recommendations.length > 0 && (
          <div className="bg-gray-50 py-12 pl-24 border-t">
            <h3 className="text-2xl font-bold mb-8">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1">
              {recommendations.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )
      }

      {
        frequentlyBought.length > 0 && (
          <div className="bg-gray-50 py-12 pl-24 border-t">
            <h3 className="text-2xl font-bold mb-8">
              {isShowingTrending ? 'Trending Products' : 'Customers Also Bought'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1">
              {frequentlyBought.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )
      }

      <Footer />
    </div >
  );
};

export default SingleProductPage;