import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice"; 
import addressReducer from "./addressSlice"; 
import searchReducer from "./searchSlice";
import productsReducer from './productSlice'; // ✅ import the search slice

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    address : addressReducer,
    search: searchReducer,
    products: productsReducer, // ✅ add this line
  },
});

export default store;
