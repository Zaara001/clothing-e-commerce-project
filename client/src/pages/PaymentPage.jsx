// src/pages/Payment.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import { CheckoutSteps } from '../pages/Cart'; // imported your progress bar

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const user = useSelector((state) => state.auth.user);

  const DELIVERY_CHARGE = cartTotal > 1500 ? 0 : 49;
  const finalAmount = parseFloat((cartTotal + DELIVERY_CHARGE).toFixed(2));

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error('Razorpay SDK failed to load.');
      document.body.appendChild(script);
    };

    if (!razorpayLoaded) loadRazorpay();
  }, [razorpayLoaded]);

  useEffect(() => {
    if (!selectedAddress) {
      alert('No address selected. Redirecting back...');
      navigate('/checkout/address');
    }
  }, [selectedAddress, navigate]);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!razorpayLoaded) {
        alert('Payment SDK is not ready. Please try again in a moment.');
        setIsProcessing(false);
        return;
      }

      if (!selectedAddress || !selectedAddress._id) {
        alert('Invalid shipping address. Please select an address again.');
        navigate('/checkout/address');
        setIsProcessing(false);
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        alert('Your cart is empty. Please add items before payment.');
        setIsProcessing(false);
        return;
      }

      const { data: order } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`,
        { amount: finalAmount }, // Send 548.00
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Aurora Clothing',
        description: 'Complete your purchase',
        order_id: order.id,
        prefill: {
          name: user?.name || 'Your Name',
          email: user?.email || 'test@example.com',
          contact: user?.contact || '9999999999',
        },
        theme: { color: '#A06E4A' }, // matched to your brown theme
        handler: async function (response) {
          try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/payment/verify`,
              { razorpay_payment_id, razorpay_order_id, razorpay_signature },
              { withCredentials: true }
            );

            if (!verifyRes.data.success) {
              alert('❌ Payment verification failed!');
              setIsProcessing(false);
              return;
            }

            const preparedItems = cartItems.map(item => ({
              _id: item.productId._id,
              name: item.productId.name,
              quantity: item.quantity,
              price: item.productId.price,
              image: item.productId.images?.[0] || 'default.jpg',
              selectedSize: item.selectedSize,    // Add this
              selectedColor: item.selectedColor   // Add this
            }));

            const orderSaveRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
              {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                amount: finalAmount,
                items: preparedItems,
                addressId: selectedAddress._id,
                address: selectedAddress,
                deliveryCharge: DELIVERY_CHARGE,
                deliveryChargePaid: true, // Delivery fee paid during checkout
              },
              { withCredentials: true }
            );

            if (!orderSaveRes.data.success) {
              alert('❌ Failed to save the order. Please check your order history.');
              setIsProcessing(false);
              return;
            }

            try {
              await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/cart/clear`,
                {},
                { withCredentials: true }
              );
            } catch (err) {
              console.error('Failed to clear backend cart:', err);
            }

            dispatch(clearCart());

            navigate('/order-success', {
              state: {
                orderSummary: {
                  paymentId: razorpay_payment_id,
                  amount: finalAmount,
                  user: {
                    name: user?.name,
                    email: user?.email,
                  },
                  address: selectedAddress,
                  items: preparedItems,
                },
              },
            });

          } catch (err) {
            console.error('Handler error:', err);
            alert(`Order processing failed: ${err.response?.data?.message || err.message}`);
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      alert(`Payment initiation failed: ${err.response?.data?.message || err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url('/src/assets/images/headerBackground.png')` }}>
        <Header />
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <CheckoutSteps currentStep={2} /> {/* 2 = Payment step */}

        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Payment</h2>

          <p className="mb-2 text-lg text-center">Total Amount: ₹{finalAmount.toFixed(2)}</p>

          {selectedAddress && (
            <div className="mb-6 text-center text-sm text-gray-700 space-y-1">
              <p className="font-medium">Delivering to:</p>
              <p>{selectedAddress.fullName}</p>
              <p>{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
              <p>{selectedAddress.phone}</p>
            </div>
          )}

<button
  onClick={handlePayment}
  disabled={isProcessing || !cartItems.length}
  className={`w-full bg-[#A06E4A] text-white py-3 rounded-lg hover:bg-[#8c5c3d] transition ${
    isProcessing || !cartItems.length ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isProcessing ? 'Processing...' : `Pay ₹${finalAmount.toFixed(2)}`}
  {DELIVERY_CHARGE === 0 && (
    <span className="block text-xs mt-1">(Free shipping applied)</span>
  )}
</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Payment;
