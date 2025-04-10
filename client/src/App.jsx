import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerAuth from "./pages/SellerLogin";
import SellerRegister from "./component/seller/SellerRegister";
import WomenCollection from "./pages/WomenCollection";
import DashboardHome from "./pages/seller/DashboardHome";
import ProductsPage from "./pages/seller/ProductsPage";
import AddProductPage from "./pages/seller/AddProductPage";
import EditProductPage from "./pages/seller/EditProductPage";
import TransactionsPage from "./pages/seller/TransactionsPage";
import AccountSettingsPage from "./pages/seller/AccountSettingsPage";
import { AuthProvider } from "./context/AuthContext";
import { SellerProvider } from "./context/sellerContext";
import SellerProtectedRoute from "./component/seller/SellerProtectedRoute";
import SellerLayout from "./pages/seller/SellerLayout";
import SingleProductPage from "./component/common/singleProductPage"; 
import ProductCategoryPage from "./pages/productCategoryPage"// ✅ added

const App = () => {
  return (
    <AuthProvider>
      <SellerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller-login" element={<SellerAuth />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/women" element={<WomenCollection />} />
            <Route path="/product/:id" element={<SingleProductPage />} /> 
            <Route path="/category/:categoryName" element={<ProductCategoryPage />} />
            <Route
              path="/seller"
              element={
                <SellerProtectedRoute>
                  <SellerLayout />
                </SellerProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/add" element={<AddProductPage />} />
              <Route path="products/edit/:id" element={<EditProductPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="settings" element={<AccountSettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </SellerProvider>
    </AuthProvider>
  );
};

export default App;
