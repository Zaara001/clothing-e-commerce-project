import React from "react";
import { WomenCollectionCategories } from "../data/Constants";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import bgImage from "../assets/images/headerBackground.png";
import { useNavigate } from "react-router-dom"; // Add this import

const WomenCollection = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Add this handler function
  const handleCategoryClick = (categoryName) => {
    // Convert category name to URL-friendly format
    const categoryPath = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/women/${categoryPath}`);
  };

  return (
    <div>
      {/* Header with background image */}
      <div
        className="relative bg-cover bg-center h-[165px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Header />
      </div>

      <div className="container mx-auto px-4 pt-10">
        <h2 className="text-3xl font-bold text-center mb-8 font-poppins pb-4">
          WOMEN'S COLLECTION
        </h2>

        <div className="flex gap-12 flex-wrap px-32">
          {WomenCollectionCategories.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(item.name)} // Add onClick handler
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-52 h-72 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-base font-poppins font-semibold">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer className="mt-14" />
    </div>
  );
};

export default WomenCollection;