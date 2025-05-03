import React from 'react';
import Header from "../common/Header";
import bgImage from "../../assets/images/headerBackground.png";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 font-poppins">About Aurora</h1>
        
        <div className=" mb-16">
          <div className="space-y-6  mx-56">
            <h2 className="text-3xl font-semibold flex justify-center">Redefining Digital Experiences</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2025, Aurora emerged as a visionary platform committed to delivering exceptional 
              digital solutions. We bridge innovation with practicality, creating seamless experiences 
              that empower businesses and individuals alike.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-3">Innovation Driven</h3>
              <p className="text-gray-600">Pioneering cutting-edge solutions through continuous R&D</p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-3">User-Centric Design</h3>
              <p className="text-gray-600">Crafting intuitive interfaces with exceptional UX/UI</p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-xl font-semibold mb-3">Ethical Operations</h3>
              <p className="text-gray-600">Maintaining transparency and data integrity</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-600">
            Join thousands of satisfied clients in our journey to digital excellence
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;