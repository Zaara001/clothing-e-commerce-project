import React from "react";

const Tabs = () => {
  const categories = [
    { name: "Dress", count: 50 },
    { name: "Jacket", count: 26 },
    { name: "Skirt", count: 121 },
    { name: "Bag", count: 21 },
  ];

  return (
    <div className="flex gap-4 mb-4">
      {categories.map((tab, index) => (
        <button
          key={index}
          className="border border-black px-4 py-2 rounded text-sm hover:bg-black hover:text-white"
        >
          {tab.name} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default Tabs;
