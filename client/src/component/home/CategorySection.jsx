import React from "react";
import { Link } from "react-router-dom";  // ✅ Import Link for navigation
import CollectionCard from "../common/collectionCard";
import { collectionData } from "../../data/Constants";
import winter from "../../assets/images/winter.png";

const CategorySection = () => {
  return (
    <section className="relative flex justify-center items-center flex-col z-50">
      <div className="h-[650px] w-[1100px] bg-customBrown bottom-16 relative">
        <div className="absolute flex flex-wrap justify-center items-center top-10">
          {collectionData.map((item, index) => (
            <Link 
              key={index} 
              to={item.title.includes("WOMEN") ? "/women" : "#"}   // ✅ Navigate to WomenCollection
            >
              <CollectionCard {...item} />
            </Link>
          ))}
        </div>
      </div>
      
      <div className="absolute top-[520px] h-screen -z-10 w-full flex justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          <img 
            className="w-full h-full object-cover" 
            src={winter} 
            alt="Winter Collection" 
          />
          <div className="absolute text-center text-white">
            <h1 className="text-4xl font-bold">WINTER COLLECTION</h1>
            <p className="mt-2 text-lg max-w-lg">
              Stay warm in style with our Winter Collection. From cozy sweaters to elegant coats, embrace the season with fashion that keeps you comfortable and trendy.
            </p>
            <button className="w-64 mt-7 py-3 font-bold  cursor-pointer border-2 border-[#805C47] transition-all duration-300 hover:text-customBrown hover:border-[#805C47] hover:shadow-[0_0_10px_#805C47]">
  S H O P N O W!
</button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
