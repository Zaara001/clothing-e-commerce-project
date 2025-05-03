import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import bgImage from "../assets/images/headerBackground.png";
import ProductCard from '../component/common/ProductCard';
import {
  fetchCartItemsAsync,
  removeItemFromCartAsync,
  updateCartItemAsync,
} from '../redux/cartSlice';
import axios from 'axios';

// Checkout Steps Component
export const CheckoutSteps = ({ currentStep }) => {
  const steps = ['Shopping Cart', 'Address', 'Payment', 'Summary'];

  return (
    <div className="flex justify-center items-center my-20 space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2
            ${index <= currentStep ? 'bg-[#A06E4A] text-white border-[#A06E4A]' : 'border-gray-300 text-gray-400'}`}>
            {index + 1}
          </div>
          <span className={`text-sm font-semibold ${index <= currentStep ? 'text-[#A06E4A]' : 'text-gray-400'}`}>
            {step}
          </span>
          {index !== steps.length - 1 && <div className="w-8 border-t-2 border-gray-300"></div>}
        </div>
      ))}
    </div>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const { items, loading, error } = useSelector(state => state.cart);

  // Constants
  const FREE_SHIPPING_THRESHOLD = 1500;
  const STANDARD_SHIPPING_FEE = 49;

  // Calculate cart values
  const subtotal = items.reduce(
    (sum, item) => sum + (item.productId.price * item.quantity), 
    0
  );
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = (subtotal + deliveryFee).toFixed(2);
  const progressToFreeShipping = Math.min(
    100, 
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  useEffect(() => {
    dispatch(fetchCartItemsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      fetchSimilarProducts();
    }
  }, [items]);

  const fetchSimilarProducts = async () => {
    try {
      setLoadingSimilar(true);
      const firstProductId = items[0]?.productId?._id;
      if (firstProductId) {
        const res = await axios.get(`/api/product/recommendations/${firstProductId}/similar`);
        setSimilarProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching similar products:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleRemove = (item) => {
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      dispatch(removeItemFromCartAsync({
        productId: item.productId._id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems(prev => ({ ...prev, [productId]: true }));
      await dispatch(updateCartItemAsync({ productId, quantity: newQuantity })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout/address', { 
      state: { 
        cartTotal: parseFloat(grandTotal),
        deliveryFee
      } 
    });
  };

  if (loading && items.length === 0) return <p className="text-center">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div
        className="relative bg-cover bg-center h-[165px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Header />
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">CART</h1>
        <CheckoutSteps currentStep={0} />

        {items.length === 0 ? (
          <p className="text-center">
            Your cart is empty. <Link to="/" className="text-blue-500 underline">Continue Shopping</Link>.
          </p>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Product List */}
              <div className="flex-1 space-y-6">
                {/* Free Shipping Progress Bar */}
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                      </span>
                      <span>{Math.round(progressToFreeShipping)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${progressToFreeShipping}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="hidden md:grid grid-cols-6 gap-4 font-semibold text-gray-700 mb-2">
                  <div className="col-span-2">Product</div>
                  <div className="col-span-1 text-center">Quantity</div>
                  <div className="col-span-1 text-center">Price</div>
                  <div className="col-span-1 text-center">Subtotal</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {items.map(item => (
                  <div key={item.productId._id} className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-lg shadow">
                    {/* Product */}
                    <div className="flex items-center space-x-4 col-span-2">
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <Link to={`/product/${item.productId._id}`} className="text-lg font-semibold hover:underline">
                          {item.productId.name}
                        </Link>
                        <p className="text-gray-500 text-sm">
                          Color: {item.selectedColor}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-center items-center col-span-1 space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                        disabled={updatingItems[item.productId._id] || item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-50"
                      >
                        –
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value, 10);
                          if (!isNaN(newQty)) {
                            handleQuantityChange(item.productId._id, newQty);
                          }
                        }}
                        min="1"
                        className="w-12 text-center border rounded"
                        disabled={updatingItems[item.productId._id]}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                        disabled={updatingItems[item.productId._id]}
                        className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-center col-span-1">
                      ₹{item.productId.price.toFixed(2)}
                    </div>

                    {/* Subtotal */}
                    <div className="text-center col-span-1 font-semibold">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <div className="flex flex-col items-center col-span-1">
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-red-500 text-sm"
                        disabled={updatingItems[item.productId._id]}
                      >
                        Remove
                      </button>
                      {updatingItems[item.productId._id] && (
                        <span className="text-gray-400 text-xs mt-1">Updating...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Cart Summary */}
              <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {deliveryFee === 0 && (
                    <p className="text-green-600 text-sm">
                      🎉 You've qualified for free shipping!
                    </p>
                  )}

                  <div className="flex justify-between font-bold text-lg border-t pt-4">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#A06E4A] text-white py-3 rounded-lg hover:bg-[#8c5c3d] transition"
                >
                  Checkout
                </button>
              </div>
            </div>

            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
              <div className="mt-10 ml-24">
                <h3 className="text-2xl font-bold mb-8">Similar Products</h3>
                {loadingSimilar ? (
                  <div className="flex justify-center">Loading similar products...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1">
                    {similarProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;