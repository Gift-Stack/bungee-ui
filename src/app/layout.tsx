import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";

import ClientBody from "../components/client-body";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bungee Protocol - Swap tokens across chains",
  description:
    "Bungee is a liquidity marketplace that lets you swap into any token on any chain in a fully abstracted manner. Trade any token with the best quotes and a gasless UX!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ClientBody>{children}</ClientBody>
        <Toaster position="top-right" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}
