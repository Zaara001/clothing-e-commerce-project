// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // other state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;  // Store user details after login
    },
    // other actions
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
