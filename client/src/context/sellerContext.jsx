import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance'; // adjust the path if needed


const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // For route protection

  // ✅ Fetch seller info from protected backend route
  const fetchSeller = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:3000/seller/me", {
        withCredentials: true,
      });
      setSeller(res.data.seller);
    } catch (err) {
      console.error("❌ Error fetching seller:", err.response?.data || err.message);
      setSeller(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout seller (clears seller state + cookie)
  const logoutSeller = async () => {
    try {
      await axiosInstance.post("http://localhost:3000/seller/logout", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("❌ Logout error:", err.response?.data || err.message);
    } finally {
      setSeller(null);
    }
  };

  // ✅ On app mount, check if seller is logged in
  useEffect(() => {
    fetchSeller();
  }, []);

  return (
    <SellerContext.Provider
      value={{
        seller,
        setSeller,
        products,
        setProducts,
        orders,
        setOrders,
        fetchSeller,
        logoutSeller,
        loading,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => useContext(SellerContext);
