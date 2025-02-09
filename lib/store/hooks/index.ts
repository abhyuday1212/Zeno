//hooks/index.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`

// whenever you want to send data into the store, you use useAppDispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// whenever you want to get data from the store, you use useAppSelector
export const useAppSelector = useSelector.withTypes<RootState>();

// whenever you want to get the store, you use useAppStore
export const useAppStore = useStore.withTypes<AppStore>();
    