import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const AnalyticsGrid = () => {
  const [metrics, setMetrics] = useState([]);
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
        const response = await axiosInstance.get('/seller/analytics/summary');
        
        setMetrics([
          { 
            title: 'Revenue', 
            value: formatINR(response.data.revenue),
            change: response.data.revenueChange,
            secondary: `${response.data.orders} orders`
          },
          { 
            title: 'Orders', 
            value: response.data.orders,
            change: response.data.ordersChange
          },
          { 
            title: 'Successful Orders', 
            value: response.data.successfulOrders || response.data.orders,
            change: response.data.successfulOrdersChange || '+0%'
          },
          { 
            title: 'Avg. Order Value', 
            value: formatINR(response.data.avgOrderValue || 0),
            change: response.data.avgOrderChange || '+0%'
          },
          { 
            title: 'Total Customers', 
            value: response.data.newCustomers || 0,
            change: response.data.newCustomersChange || '+0%'
          }
          // Removed Repeat Customers metric
        ]);
        
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to sample data with INR formatting
        setMetrics([
          { title: 'Revenue', value: formatINR(782500), change: '+22%', secondary: '92 orders' },
          { title: 'Orders', value: '92', change: '+12%' },
          { title: 'Successful Orders', value: '88', change: '+15%' },
          { title: 'Avg. Order Value', value: formatINR(8505), change: '+24%' },
          { title: 'New Customers', value: '65', change: '+18%' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse h-24"></div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">{metric.title}</h3>
          <p className="text-2xl font-bold">{metric.value}</p>
          {metric.change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${
                metric.change.startsWith('+') ? 'text-green-500' : 
                metric.change.startsWith('-') ? 'text-red-500' : 
                'text-gray-500'
              }`}>
                {metric.change}
              </span>
              {metric.secondary && (
                <span className="text-xs text-gray-500 ml-2">{metric.secondary}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalyticsGrid;