import React from 'react';
import Header from "../common/Header";
import bgImage from "../../assets/images/headerBackground.png";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 font-poppins">Contact Aurora</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">General Inquiries</h3>
                  <a href="mailto:nivethethaelango@gmail.com" className="text-blue-600 text-lg">nivethethaelango@gmail.com</a>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Technical Support</h3>
                  <a href="mailto:support@aurora.com" className="text-blue-600 text-lg">auroraclothing.orders@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Operational Hours</h2>
              <p className="mb-2">Monday-Friday: 8:00 AM - 8:00 PM IST</p>
              <p>Saturday: 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default ContactUs;