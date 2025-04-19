"use client";

import { useEffect } from "react";
import AppHeader from "@/components/app-header";
import Providers from "@/providers";

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
    <Providers>
      <div className="flex flex-col min-h-screen">
        <AppHeader />

        <main className="flex-1 flex items-center justify-center px-4 pt-[120px]">
          {children}
        </main>
      </div>
    </Providers>
  );
}
