import { configureStore } from "@reduxjs/toolkit";

//Slices Imports
import globalLineLoaderReducer from "./features/globalLineLoaderSlice";
import socketReducer from "./features/socketSlice";
import callReducer from "./features/callSlice";

// const customizedMiddleware = getDefaultMiddleware({
//   serializableCheck: false,
// });

export const makeStore = () => {
  return configureStore({
    reducer: {
      globalLineLoader: globalLineLoaderReducer,
      socketContext: socketReducer,
      callContext: callReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
