import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const BestsellersTable = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format currency for Indian Rupees
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/seller/analytics/bestsellers');
        setBestsellers(response.data.map(item => ({
          product: item.name,
          price: formatINR(item.price),
          sold: item.sold,
          profit: formatINR(item.revenue * 0.3) // 30% profit margin
        })));
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        // Fallback to sample data
        setBestsellers([
          { product: 'Cut jacket with basic', price: formatINR(2119), sold: 409, profit: formatINR(1822.87) },
          { product: 'Black jacket', price: formatINR(1418), sold: 396, profit: formatINR(8545.25) },
          { product: 'Nicky shoes', price: formatINR(1815), sold: 243, profit: formatINR(7287.01) },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse h-64"></div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Bestselling Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bestsellers.length > 0 ? (
              bestsellers.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.profit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No bestselling products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestsellersTable;