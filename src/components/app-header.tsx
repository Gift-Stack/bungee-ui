import Link from "next/link";
import React from "react";
import WalletConnector from "./wallet-connector";

const AppHeader = () => {
  return (
    <div className="fixed top-0 left-0 z-50 h-fit w-full border-0 border-b border-border-dark border-solid backdrop-blur-md">
      <BetaBanner />
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
          <WalletConnector />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;

const BetaBanner = () => {
  return (
    <div className="bg-bungee-gold/20 text-bungee-gold px-3 py-3 text-center font-normal text-sm">
      Beta Version: Improvements are in progress.
    </div>
  );
};
