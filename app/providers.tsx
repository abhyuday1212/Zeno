"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";
import SocketInitializer from "./SocketInitialiser";



export function Providers({ children, session }) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider
          session={session}
          refetchInterval={5 * 60} // Only refresh every 5 minutes
          refetchOnWindowFocus={false}
        >
          <SocketInitializer>
            <div>{children}</div>
          </SocketInitializer>
        </SessionProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
