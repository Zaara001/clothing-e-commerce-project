import AnalyticsGrid from './../../component/seller/dashboard/AnalyticsGrid';
import BestsellersTable from './../../component/seller/dashboard/BestsellersTable';
import RecentOrders from './../../component/seller/dashboard/RecentOrders';
import SalesCharts from './../../component/seller/dashboard/SalesCharts';

const DashboardHome = () => {
  return (
      
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        
        <AnalyticsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Bestsellers</h2>
            <BestsellersTable />
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <RecentOrders />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
          <SalesCharts />
        </div>
        
      </div>
  );
};

export default DashboardHome;