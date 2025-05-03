import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import bgImage from "../assets/images/headerBackground.png";
import { useNavigate } from 'react-router-dom';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/orders/all-orders');
        setOrders(response.data.orders);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderStatusMessage = (status) => {
    switch (status) {
      case 'Shipping':
        return "In-Transit";
      case 'Delivered':
        return "Delivered";
      case 'Cancelled':
        return "Cancelled";
      case 'Pending':
      default:
        return "Processing";
    }
  };

  const handleViewDetails = (order) => {
    navigate('/order-details', { state: { order } });
  };

  if (loading) return <div className="text-center py-10 text-brown-700">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

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
          <h2 className="text-3xl font-semibold text-brown-800 mb-8">My Orders</h2>

          {orders.length === 0 ? (
            <p className="text-brown-600 text-center">No orders found</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white shadow-md rounded-2xl mb-8 p-6 border border-brown-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-brown-700 font-semibold">
                    Order <span className="text-brown-600">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="text-sm text-brown-500">
                    Order Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="space-y-6">
                  {order.orderItems.map(item => (
                    <div key={item.productId} className="flex items-center gap-6">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="font-semibold text-brown-800">{item.name}</div>
                        <div className="text-sm text-brown-500 mt-1">
                          Size: {item.selectedSize || 'N/A'} | Qty: {item.quantity}
                        </div>
                        <div className="text-brown-700 font-medium mt-1">
                          ₹{item.priceAtPurchase}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-brown-600 font-medium">
                          Status:
                        </div>
                        <div className="text-brown-800 font-semibold">
                          {getOrderStatusMessage(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t mt-6 pt-4 flex justify-between items-center">
                  <div className="text-brown-600 text-sm">
                    Paid via {order.paymentInfo.method} {order.paymentInfo.cardLast4 ? `• ****${order.paymentInfo.cardLast4}` : ''}
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="text-brown-700 hover:text-brown-900 font-medium"
                    >
                      View Details
                    </button>
                    <div className="text-brown-800 font-bold text-lg">
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrdersPage;