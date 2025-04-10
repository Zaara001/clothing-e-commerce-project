import React from 'react';

const FilterSidebar = () => {
  const filters = {
    brand: [
      { name: "Tokyo Talkies", count: 206 },
      { name: "Roadster", count: 26 },
      { name: "Heres&How", count: 706 },
      { name: "High Star", count: 64 },
      { name: "Miss Chase", count: 16 },
      { name: "Voxett", count: 20 }
    ],
    price: [
      { range: "Rs 350 to Rs 500", count: 206 },
      { range: "Rs 500 to Rs 700", count: 100 }
    ],
    color: [
      { name: "Blue", count: 206 }
    ]
  };

  return (
    <aside className="w-72 p-4 bg-white border-r">
      <h3 className="text-lg font-bold mb-6">Filters</h3>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Brand</h4>
        <div className="space-y-2">
          {filters.brand.map((brand, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4" />
                <span>{brand.name}</span>
              </label>
              <span className="text-gray-500 text-sm">({brand.count})</span>
            </div>
          ))}
          <button className="text-blue-600 text-sm mt-2">+ 40 more</button>
        </div>
      </div>
      
      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price</h4>
        <div className="space-y-2">
          {filters.price.map((price, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4" />
                <span>{price.range}</span>
              </label>
              <span className="text-gray-500 text-sm">({price.count})</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Color</h4>
        <div className="space-y-2">
          {filters.color.map((color, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 h-4 w-4" />
                <span>{color.name}</span>
              </label>
              <span className="text-gray-500 text-sm">({color.count})</span>
            </div>
          ))}
          <button className="text-blue-600 text-sm mt-2">+ 4 more</button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;