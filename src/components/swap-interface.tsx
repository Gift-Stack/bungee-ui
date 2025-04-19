"use client";

import { useState } from "react";
import Image from "next/image";

export default function SwapInterface() {
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="relative w-[420px]">
      {/* Main Swap Card */}
      <div className="bg-layer-1 p-4 min-w-[360px] relative overflow-hidden border border-solid border-border-dark w-full rounded-2xl">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-text-primary text-xl font-semibold">Swap</p>
            <div className="flex items-center space-x-2">
              <button
                className="bg-transparent h-9 w-9 flex items-center justify-center border-none cursor-pointer text-text-primary"
                type="button"
              >
                <img
                  src="https://ext.same-assets.com/1381159192/3783633550.svg"
                  alt="Settings Icon"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>

          {/* First Input - Source Token */}
          <div className="bg-layer-2 mt-4 relative overflow-hidden rounded-lg">
            <div className="relative pt-[19px]">
              <div className="px-[18px] border-0 border-b border-solid border-border-dark pb-[35px]">
                <div className="flex items-center justify-between w-full">
                  <div className="w-full">
                    <input
                      className="text-text-primary border-none bg-transparent outline-none text-[22px] font-medium w-full text-ellipsis"
                      placeholder="0.00"
                      inputMode="decimal"
                      spellCheck="false"
                      id="amount"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      autoComplete="off"
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className="p-2 rounded-full flex items-center cursor-pointer border-none font-semibold text-text-primary space-x-1.5 disabled:opacity-20 text-lg leading-[22px] bg-layer-3"
                    type="button"
                  >
                    <div className="relative w-5 h-5">
                      <div className="rounded-full overflow-hidden relative w-full h-full">
                        <img
                          alt="ETH icon"
                          className="object-cover absolute top-0 left-0 size-5"
                          src="https://ext.same-assets.com/1381159192/2961692435.svg"
                        />
                        <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                      </div>
                      <div className="rounded-full overflow-hidden h-2.5 w-2.5 absolute bottom-0 -right-[2.5px]">
                        <img
                          alt="Chain icon"
                          className="object-cover absolute top-0 left-0 size-2.5"
                          src="https://ext.same-assets.com/1381159192/2578158177.svg"
                        />
                        <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                      </div>
                    </div>
                    <span className="whitespace-nowrap"> ETH</span>
                  </button>
                </div>
                <div className="flex items-center w-full mt-2.5 h-5 justify-end">
                  <div className="text-sm text-text-secondary flex items-center ml-auto">
                    <p>
                      Bal: <span className="text-text-primary">0</span>
                    </p>
                    <button
                      type="button"
                      className="bg-bungee-gold/10 border-none px-[5px] py-[3px] ml-1 cursor-pointer text-bungee-gold rounded-sm"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Switch Button */}
              <button
                className="w-9 h-9 rounded-full border-none bg-layer-3 flex items-center justify-center hover:rotate-180 p-0 opacity-60 absolute left-0 right-0 mx-auto top-[103px] cursor-pointer"
                type="button"
                disabled
              >
                <img
                  src="https://ext.same-assets.com/1381159192/2563901416.svg"
                  alt="Switch Chevron"
                  className="w-4 h-[17px]"
                />
              </button>

              {/* Second Input - Destination Token */}
              <div className="px-[18px] pt-[35px] pb-[19px]">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <input
                      className="text-text-primary border-none bg-transparent outline-none text-[22px] font-medium w-full text-ellipsis"
                      placeholder="0.00"
                      inputMode="decimal"
                      spellCheck="false"
                      id="output-amount"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      autoComplete="off"
                      type="text"
                      value=""
                      readOnly
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-layer-3 p-2 text-text-primary font-medium text-base flex items-center cursor-pointer whitespace-nowrap border-none rounded-[32px]"
                      type="button"
                    >
                      Select Token
                      <span className="material-symbols-rounded text-2xl flex-shrink-0">
                        keyboard_arrow_down
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center w-full mt-2.5 h-5 justify-between">
                  <div className="flex items-center space-x-1">
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="relative h-[50px] text-black text-base flex items-center justify-center border-none bg-bungee-gold disabled:bg-layer-2 disabled:text-text-secondary font-bold w-full text-center cursor-pointer mt-4 rounded-lg"
            disabled
          >
            No Quote Found
          </button>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex items-center justify-center mt-2">
        <button
          type="button"
          className="w-2 h-2 rounded-full bg-bungee-gold mx-1"
          tabIndex={0}
        />
      </div>

      {/* Promotion Banner */}
      <div className="h-[142px]">
        <div>
          <div className="bg-layer-1 rounded-2xl p-4 mt-2 overflow-hidden border border-solid border-border-dark relative">
            <div className="flex items-center justify-between space-x-1">
              <div className="relative z-10 max-w-[314px]">
                <p className="text-bungee-gold text-base font-medium">
                  Buy Stocks onchain &amp; Get Rewarded!
                </p>
                <p className="text-text-primary text-sm font-normal">
                  Get 100% fee rebates on Gnosis for every swap into bCSPX,
                  bTSLA via Bungee{" "}
                  <a
                    href="https://medium.com/bungee-exchange/bungee-x-kpk-x-gnosis-access-tesla-stock-s-p-500-onchain-with-instant-rewards-91d6bbc75a74"
                    className="text-bungee-gold underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read More
                  </a>
                </p>
              </div>
              <img
                src="https://ext.same-assets.com/1381159192/548389142.svg"
                alt="backed logo"
                width="61"
                height="60"
                className="w-[61px] h-[60px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
