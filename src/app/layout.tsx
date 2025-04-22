import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";
import { validateEnv } from "@/lib/env";
import ClientBody from "../components/client-body";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Call validateEnv during module initialization
// This will run on the server side during build and startup
validateEnv();

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
      <body className={`${inter.variable} font-sans`}>
        <ClientBody>{children}</ClientBody>
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}
