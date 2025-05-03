import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance'; // ✅ your axios setup

// Fetch cart items
const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/cart');
      return data; // return populated cart data with product details
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const addItemToCartAsync = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity, selectedColor, selectedSize }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post('/cart/add', { productId, quantity, selectedColor, selectedSize });
      const fetchAction = await dispatch(fetchCartItemsAsync());
      return fetchAction.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Remove item from cart
const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItem',
  async ({ productId, selectedColor, selectedSize }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post('/cart/remove', { productId, selectedColor, selectedSize });
      const fetchAction = await dispatch(fetchCartItemsAsync());
      return fetchAction.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update item quantity (with /cart/update route)
const updateCartItemAsync = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity, selectedColor, selectedSize }, { dispatch, rejectWithValue }) => {
    try {
      if (quantity < 1) {
        return rejectWithValue('Quantity must be at least 1');
      }

      await axiosInstance.put('/cart/update', { productId, quantity, selectedColor, selectedSize });
      const fetchAction = await dispatch(fetchCartItemsAsync());
      return fetchAction.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        // Calculate the total amount based on populated product data
        state.totalAmount = state.items.reduce((total, item) => {
          const product = item.productId; // Access the populated product data
          if (!product) return total; // If no product, continue
          return total + product.price * item.quantity; // Calculate total price
        }, 0);
      })
      .addCase(fetchCartItemsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Export thunks
export {
  fetchCartItemsAsync,
  addItemToCartAsync,
  removeItemFromCartAsync,
  updateCartItemAsync,
};
