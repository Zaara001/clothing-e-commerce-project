import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProductsAsync } from "./redux/productSlice"; // Ensure this path is correct

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./component/common/ScrollToTop"; // ✅ Add this import

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
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import AddressPage from "./pages/AddressPage";
import Payment from "./pages/PaymentPage";
import OrderSuccess from "./pages/SummaryPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import SellerOrders from "./component/seller/SellerOrderPage"; 
import SearchResults from "./pages/SearchPage"; // Import the new page
import AboutUs from "./component/footerContent/about"; // Import the new page
import ContactUs from "./component/footerContent/contact"; // Import the new page
import FAQs from "./component/footerContent/faqs"; // Import the new page   
import PrivacyPolicy from "./component/footerContent/privacyPolicy"; // Import the new page
import TermsOfUse from "./component/footerContent/termsOfUse"; // Import the new page
import OrderDetailsPage from "./pages/OrderDetailsPage"; // Import the new page





const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsAsync()); // ✅ Fetch products when app loads
  }, [dispatch]);

  return (
    <AuthProvider>
      <SellerProvider>
        <Router>
          <ScrollToTop /> {/* ✅ Add it here */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller-login" element={<SellerAuth />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/women" element={<WomenCollection />} />
            <Route path="/product/:id" element={<SingleProductPage />} /> 
            <Route path="/:targetAudience/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/address" element={<AddressPage />} />
            <Route path="/checkout/payment" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-page" element={<UserOrdersPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<AboutUs />} />


<Route path="/contact" element={<ContactUs />} />
<Route path="/faqs" element={<FAQs />} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-of-use" element={<TermsOfUse />} />
<Route path="/order-details" element={<OrderDetailsPage />} />
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
              <Route path="/seller/edit-product/:productId" element={<EditProductPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="settings" element={<AccountSettingsPage />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
            </Route>
          </Routes>
        </Router>
      </SellerProvider>
    </AuthProvider>
  );
};

export default App;
