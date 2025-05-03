import React from 'react';
import Header from "../common/Header";
import bgImage from "../../assets/images/headerBackground.png";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-cover bg-center h-[165px]" style={{ backgroundImage: `url(${bgImage})` }}>
        <Header />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 font-poppins">Terms of Service</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing Aurora's platform, you agree to comply with these binding terms 
              and all applicable laws and regulations.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
            <p>
              Users must not:
              <ul className="list-disc pl-6 mt-2">
                <li>Reverse engineer any platform components</li>
                <li>Use services for illegal activities</li>
                <li>Share login credentials</li>
              </ul>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Termination Rights</h2>
            <p>
              Aurora reserves the right to suspend accounts for:
              <ul className="list-disc pl-6 mt-2">
                <li>Violation of these terms</li>
                <li>Payment failures</li>
                <li>Security concerns</li>
              </ul>
            </p>
          </div>

          <div className="text-center mt-8">
            <p>For clarification contact: <a href="mailto:nivethethaelango@gmail.com" className="text-blue-600">nivethethaelango@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;