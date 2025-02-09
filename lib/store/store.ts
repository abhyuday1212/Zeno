import { configureStore } from "@reduxjs/toolkit";

//Slices Imports
import chatHistoryReducer from "./features/historySlice";
import globalLineLoaderReducer from "./features/globalLineLoaderSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      chatHistory: chatHistoryReducer,
      globalLineLoader: globalLineLoaderReducer,
    },
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
