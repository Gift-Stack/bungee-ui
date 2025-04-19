"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Use for...of instead of forEach for better performance
      const classList = [...document.documentElement.classList];
      for (const className of classList) {
        if (className.startsWith("__simple")) {
          document.documentElement.classList.remove(className);
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Beta Banner */}
      <div className="fixed top-0 left-0 z-50 h-fit w-full border-0 border-b border-border-dark border-solid backdrop-blur-md">
        <div className="bg-bungee-gold/20 text-bungee-gold px-3 py-3 text-center font-normal text-sm">
          Beta Version: Improvements are in progress.
        </div>
        <div className="flex h-[80px] items-center justify-between px-6 sm:px-[64px] bg-layer-1">
          <Link href="/" className="flex items-center">
            <div className="h-[36px] w-[36px] relative">
              <div className="flex space-x-1">
                <div className="h-6 w-6 bg-[#FF0050] rounded-full" />
                <div className="h-6 w-6 bg-white rounded-full" />
                <div className="h-6 w-6 bg-[#00E06C] rounded-full" />
              </div>
            </div>
          </Link>
          <div className="flex items-center justify-between space-x-5">
            <button
              className="bg-bungee-gold text-black rounded-full px-7 py-3 text-lg font-semibold leading-[21.6px]"
              type="button"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-[120px]">
        {children}
      </main>
    </div>
  );
}
