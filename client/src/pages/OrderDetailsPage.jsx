import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import bgImage from "../assets/images/headerBackground.png";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">      
        <h2 className="text-xl font-semibold mb-4">No Order Details Found</h2>
        <button
          onClick={() => navigate('/orders')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative bg-cover bg-center h-[165px] w-full"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Header />
      </div>

      <div className="min-h-screen bg-brown-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-brown-800">
              Order Details #{order._id.slice(-6).toUpperCase()}
            </h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-brown-600 hover:text-brown-800"
            >
              ← Back to Orders
            </button>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border border-brown-200">
            {/* Order Status */}
            <div className="mb-6 p-4 bg-brown-50 rounded-lg">
              <h3 className="text-lg font-semibold text-brown-700 mb-2">Order Status</h3>
              <div className="flex items-center gap-4">
                <div className="text-brown-800 font-semibold">
                  {order.status === 'Pending' ? 'Processing' : 
                   order.status === 'Shipping' ? 'In Transit' : 
                   order.status}
                </div>
                <div className="text-brown-500 text-sm">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Items */}
            <h3 className="text-xl font-semibold text-brown-800 mb-4">Items Ordered</h3>
            <div className="space-y-4 mb-8">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border-b border-brown-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md" 
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-brown-800">{item.name}</h4>
                    <div className="text-sm text-brown-500 mt-1">
                      Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                    </div>
                    <div className="text-brown-700 font-medium mt-2">
                      ₹{item.priceAtPurchase.toFixed(2)} each
                    </div>
                  </div>
                  <div className="text-brown-800 font-semibold">
                    ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-brown-800 mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brown-600">Subtotal:</span>
                    <span>₹{(order.totalAmount - order.deliveryCharge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-600">Delivery Fee:</span>
                    <span>₹{order.deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-brown-200 pt-2 mt-2">
                    <span className="text-brown-800 font-semibold">Total:</span>
                    <span className="text-brown-800 font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-brown-500 mt-2">
                    Paid via {order.paymentInfo.method} on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brown-800 mb-4">Delivery Address</h3>
                <div className="text-brown-700">
                  <p>{order.shippingAddress?.fullName || 'N/A'}</p>
                  <p>{order.shippingAddress?.street || 'N/A'}</p>
                  <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} - {order.shippingAddress?.pincode || 'N/A'}</p>
                  <p>Phone: {order.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Meta */}
            <div className="text-sm text-brown-500">
              <p>Order ID: {order._id}</p>
              <p>Payment ID: {order.paymentInfo.paymentId}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetailsPage;