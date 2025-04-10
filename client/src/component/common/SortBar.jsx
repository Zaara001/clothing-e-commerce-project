import React from 'react';

const SortBar = () => {
  return (
    <select className="border px-2 py-1 rounded text-sm">
      <option value="relevance">Sort by: Relevance</option>
      <option value="lowToHigh">Price: Low to High</option>
      <option value="highToLow">Price: High to Low</option>
      <option value="discount">Discount</option>
    </select>
  );
};

export default SortBar;
