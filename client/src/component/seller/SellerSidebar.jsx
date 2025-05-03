import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  UsersIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useCallback } from 'react';

const SellerSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/seller/logout", {
        method: "GET",
        credentials: "include",
      });
  
      if (res.ok) {
        console.log("✅ Logout success");
        navigate("/"); // use navigate instead of window.location.href
      } else {
        console.error("❌ Logout failed:", res.status);
      }
    } catch (error) {
      console.error("❌ Logout failed:", error.message);
    }
  };
  
  

  return (
    <div className="w-64 bg-white shadow-md fixed h-full flex flex-col justify-between">
      <div>
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">Aurora</h1>
        </div>
        <nav className="mt-4">
          <NavLink
            to="/seller/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${isActive ? 'bg-gray-100 text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/seller/products"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${isActive ? 'bg-gray-100 text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <ShoppingBagIcon className="w-5 h-5 mr-3" />
            My Products
          </NavLink>
          <NavLink
            to="/seller/orders"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${isActive ? 'bg-gray-100 text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <CreditCardIcon className="w-5 h-5 mr-3" />
            Orders
          </NavLink>
        </nav>
      </div>

      {/* 🔴 Logout Button (performs logout) */}
      <div className="p-4 border-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;
