const TransactionsTable = () => {
    const transactions = [
      { id: '#5089', customer: 'Skylar Torff', date: '14 Feb, 2025', total: '$2,564', device: 'PC', status: 'Completed' },
      { id: '#5089', customer: 'Kaylynn Gouse', date: '16 Feb, 2025', total: '$50.50', device: 'Mobile', status: 'Pending' },
      { id: '#5089', customer: 'Patryn Workman', date: '17 Feb, 2025', total: '$32.40', device: 'Mobile', status: 'Shipping' },
    ];
  
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.total}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.device}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-blue-600 hover:text-blue-900">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default TransactionsTable;