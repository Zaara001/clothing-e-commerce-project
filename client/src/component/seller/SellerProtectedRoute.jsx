import React from "react";
import { Navigate } from "react-router-dom";
import { useSeller } from "./../../context/sellerContext";

const SellerProtectedRoute = ({ children }) => {
  const { seller, loading } = useSeller();

  if (loading) return null; // or <LoadingSpinner /> if you have one

  if (!seller) {
    return <Navigate to="/seller-login" replace />;
  }

  return children;
};

export default SellerProtectedRoute;
