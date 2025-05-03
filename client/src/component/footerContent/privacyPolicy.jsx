import React from 'react';
import Header from "../common/Header";
import bgImage from "../../assets/images/headerBackground.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 font-poppins">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">Effective: January 1, 2025 | Last Updated: May 3, 2025</p>

            <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
            <p className="mb-4">
              Aurora collects:
              <ul className="list-disc pl-6 mt-2">
                <li>Account registration details</li>
                <li>Service usage patterns and analytics</li>
                <li>Payment information through PCI-DSS compliant gateways</li>
              </ul>
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Data Usage</h2>
            <p>
              We use collected information to:
              <ul className="list-disc pl-6 mt-2">
                <li>Deliver and improve services</li>
                <li>Personalize user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
            <p>
              Aurora implements:
              <ul className="list-disc pl-6 mt-2">
                <li>256-bit SSL encryption</li>
                <li>Regular security audits</li>
                <li>Role-based access controls</li>
              </ul>
            </p>
          </div>

          <div className="text-center mt-8">
            <p>For data requests contact: <a href="mailto:nivethethaelango@gmail.com" className="text-blue-600">nivethethaelango@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;