import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { format } from 'date-fns';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get('/seller/analytics/recent-orders');
        
        if (!response.data || response.data.length === 0) {
          setOrders([]);
          setError('No recent orders found');
          return;
        }

        const formattedOrders = response.data.map(order => {
          const totalQty = order.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
          const totalAmount = order.totalAmount || 0;
        
          // Robust product name extraction
          const productDisplayNames = order.orderItems.map(item => {
            // All possible fields where the name might exist
            const possibleNameSources = [
              item.title,                      // From order item
              item.name,                       // From order item (alternate field)
              item.productId?.name,            // From populated product
              typeof item.productId === 'object' ? item.productId.title : null, // Alternate populated field
              item.productDetails?.name,       // From lookup (if backend does $lookup)
              item.productDetails?.title       // Alternate lookup field
            ];
        
            // Find the first non-empty name
            const foundName = possibleNameSources.find(
              name => name && String(name).trim() !== ''
            );
        
            // Final fallback options
            return foundName || 
                   (item.productId 
                     ? `Product ${item.productId.toString().slice(-4)}` // Last 4 chars of ID
                     : 'Product');
          });
        
          return {
            id: order._id,
            products: productDisplayNames.join(', '), // Combine multiple products
            qty: `x${totalQty}`,
            date: format(new Date(order.createdAt), 'MMM dd, yyyy'),
            revenue: `₹${(totalAmount / 100).toFixed(2)}`,
            profit: `₹${(totalAmount * 0.3 / 100).toFixed(2)}`,
            status: order.status || 'Pending'
          };
        });
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setError('Failed to load recent orders. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded">
          {error}
        </div>
      )}

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table headers same as before */}
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.profit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Refund' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No recent orders found
        </div>
      )}
    </div>
  );
};

export default RecentOrders;