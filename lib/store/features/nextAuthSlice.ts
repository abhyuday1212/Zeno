// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: null, // Initialize with null or any default value if required
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    clearAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;
