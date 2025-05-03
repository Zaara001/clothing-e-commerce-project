import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/seller/orders", {
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching seller orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.post(
        `/seller/order/status`,
        { orderId, status: newStatus },
        { withCredentials: true }
      );
      // Update the local state to reflect the status change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update order status");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4 ml-64">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-3 px-4 text-left">Products</th>
                <th className="py-3 px-4 text-left">Qty</th>
                <th className="py-3 px-4 text-left">Size</th>
                <th className="py-3 px-4 text-left">Color</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Revenue</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.orderItems?.map((item, index) => {
                  const itemKey = item._id
                    ? `${order._id}-${item._id}`
                    : `${order._id}-item-${index}`;

                  // Make sure status is always set (default "Pending")
                  const currentStatus = order.status || "Pending";

                  return (
                    <tr key={itemKey} className="border-t">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.title}</span>
                      </td>
                      <td className="py-3 px-4">x{item.quantity}</td>
                      <td className="py-3 px-4">{item.selectedSize || "-"}</td>
                      <td className="py-3 px-4">{item.selectedColor || "-"}</td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        ₹{item.priceAtPurchase * item.quantity}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            currentStatus === "Pending"
                              ? "bg-blue-100 text-blue-700"
                              : currentStatus === "Shipping"
                              ? "bg-purple-100 text-purple-700"
                              : currentStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;