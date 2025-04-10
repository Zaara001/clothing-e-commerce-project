import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_img.png"; // Ensure the correct path

export default function SellerAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #8A6F5A, #BBA190, #E0C8B0)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleGoogleLogin = () => {
    // ✅ Corrected API route for Google OAuth for sellers
    window.location.href = "http://localhost:3000/seller/auth/google/seller";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#8A6F5A] to-[#E0C8B0] px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* Logo Section - Full height */}
        <div className="hidden md:block w-1/2">
          <img
            src={logo}
            alt="Logo"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right Side - Seller Login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Become a Seller</h2>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100"
          >
            <FcGoogle className="text-2xl mr-2" /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}