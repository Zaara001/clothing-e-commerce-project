const AnalyticsGrid = () => {
    const metrics = [
      { title: 'Revenue', value: '$7,825', change: '+22%', secondary: '92Q' },
      { title: 'Orders', value: '-25%' },
      { title: 'Visitors', value: '15.5K', change: '+49%', secondary: '28%' },
      { title: 'Conversion', value: '+19%' },
      { title: 'New Visitors', value: '+24%' },
      { title: 'Store Visits', value: '8,950', change: '+22%', secondary: '1,520' },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">{metric.title}</h3>
            <p className="text-2xl font-bold">{metric.value}</p>
            {metric.change && (
              <div className="flex items-center mt-2">
                <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
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