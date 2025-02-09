import { createSlice } from "@reduxjs/toolkit";

export const globalLineLoaderSlice = createSlice({
  name: "globalLineLoader",
  initialState: {
    isLoading: false,
  },
  reducers: {
    showLineLoader: (state) => {
      state.isLoading = true;
    },

    hideLineLoader: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showLineLoader, hideLineLoader } = globalLineLoaderSlice.actions;

export default globalLineLoaderSlice.reducer;
