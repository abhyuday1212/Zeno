import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "@/components/ui/toaster";
// import { Inter } from "next/font/google";
// import GlobalLineLoader from "@/components/loaders/GlobalLineLoader";
import { Providers } from "./providers"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeno - Video Call Platform",
  description: "A Platform for deaf and mute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <Providers>
          {/* <GlobalLineLoader /> */}
          {children}
          {/* <Toaster /> */}
        </Providers>
      </body>
    </html>
  );
}
