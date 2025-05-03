import React from "react";
import { Link } from "react-router-dom";  // ✅ Import Link for navigation
import CollectionCard from "../common/collectionCard";
import { collectionData } from "../../data/Constants";
import winter from "../../assets/images/winter.png";

const CategorySection = () => {
  return (
    <section className="relative flex justify-center items-center flex-col z-40">
      <div className="h-[988px] w-[1190px] bg-[#C9A38D] bottom-16 relative">
      <div className="absolute flex flex-wrap justify-center items-center top-10">
  {collectionData.map((item, index) => (
    item.title.includes("W O M E N") ? (
      <Link 
        key={index} 
        to="/women" 
      >
        <CollectionCard {...item} />
      </Link>
    ) : (
      <div key={index}>
        <CollectionCard {...item} />
      </div>
    )
  ))}
</div>

      </div>
      
      <div className="relative bottom-32 h-screen -z-10 w-full flex justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          <img 
            className="w-full h-full object-cove brightness-75" 
            src={winter} 
            alt="Winter Collection" 
          />
          <div className="absolute text-center text-white">
            <h1 className="text-4xl font-bold font-poppins mb-20" >W I N T E R&nbsp;&nbsp;&nbsp;<span className="text-[#C9A38D]">C O L L E C T I O N</span></h1>
            <p className=" text-[15px] font-poppins max-w-lg mb-10">
              Stay warm in style with our Winter Collection. From cozy sweaters to elegant coats, embrace the season with fashion that keeps you comfortable and trendy.
            </p>
            <button className="w-56 mt-10 py-3 font-bold text-black bg-white  cursor-pointer border-2 border-[#805C47] transition-all duration-300  hover:border-[#805C47] hover:shadow-[0_0_10px_#805C47]">
  S H O P&nbsp;N O W!
</button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
