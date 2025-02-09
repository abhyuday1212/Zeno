"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
import { useTheme } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <div
            // style={
            //   {
            //     "--sidebar-width": "240px",
            //     "--sidebar-width-mobile": "240px",
            //   } as React.CSSProperties
            // }
          >
            {children}
          </div>
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
