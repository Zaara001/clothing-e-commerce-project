/* src/redux/addressSlice.js */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: JSON.parse(localStorage.getItem('addresses')) || [],
  selectedAddress: JSON.parse(localStorage.getItem('selectedAddress')) || null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddresses(state, action) {
      state.addresses = action.payload;
      localStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    setSelectedAddress(state, action) {
      state.selectedAddress = action.payload;
      localStorage.setItem('selectedAddress', JSON.stringify(state.selectedAddress));
    },
    clearSelectedAddress(state) {
      state.selectedAddress = null;
      localStorage.removeItem('selectedAddress');
    },
  },
});

export const { setAddresses, setSelectedAddress, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;