"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { useRef } from "react";
import { AppStore, makeStore } from "@/lib/store/store";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Data change hone k baad component re-render na ho to useRef use krte h
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    //Refresh hone k baad v agr data persist krna h, to localStoraget.setItem krne k baad yha per jb data load ho rha h to local storage se get krke dispatch kr do
    //   storeRef.current.dispatch(initializeCount(count));
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
