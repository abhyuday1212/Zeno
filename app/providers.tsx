"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
import { useTheme } from "next-themes";
import SocketInitializer from "./SocketInitialiser";

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
          <SocketInitializer>
            <div>{children}</div>
          </SocketInitializer>
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
