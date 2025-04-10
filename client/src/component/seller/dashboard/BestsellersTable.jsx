const BestsellersTable = () => {
    const bestsellers = [
      { product: 'Cut jacket with basic', price: '$2119', sold: 409, profit: '$1822.87' },
      { product: 'Black jacket', price: '$1418', sold: 396, profit: '$8545.25' },
      { product: 'Nicky shoes', price: '$1815', sold: 243, profit: '$7287.01' },
    ];
  
    return (
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
            {bestsellers.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{item.product}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.sold}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default BestsellersTable;