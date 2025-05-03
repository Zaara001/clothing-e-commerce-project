// src/redux/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Fetch all products
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axiosInstance.get('/api/product/all'); // Corrected endpoint
    return response.data;
  }
);

// You can create another thunk for fetching search results if needed
export const fetchSearchResultsAsync = createAsyncThunk(
  'products/fetchSearchResults',
  async (searchTerm) => {
    const response = await axiosInstance.get(`/api/product/search?keyword=${searchTerm}`); // Corrected search endpoint
    return response.data;
  }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
      items: [],  // This matches what we're accessing in the component
      status: 'idle',
      error: null,
    },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
