import SellerSidebar from './../../component/seller/SellerSidebar';
import TransactionsTable from './../../component/seller/transactions/TransactionsTable';

const TransactionsPage = () => {
  return (
      
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <input
              type="text"
              placeholder="Search transactions..."
              className="px-4 py-2 border rounded"
            />
            <select className="px-4 py-2 border rounded">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>
          
          <TransactionsTable />
        </div>
      </div>
  );
};

export default TransactionsPage;