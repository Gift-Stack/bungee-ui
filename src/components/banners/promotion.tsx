import React from "react";

const PromotionBanner = () => {
  return (
    <div className="h-[142px]">
      <div>
        <div className="bg-layer-1 rounded-2xl p-4 mt-2 overflow-hidden border border-solid border-border-dark relative">
          <div className="flex items-center justify-between space-x-1">
            <div className="relative z-10 max-w-[314px]">
              <p className="text-bungee-gold text-base font-medium">
                Buy Stocks onchain &amp; Get Rewarded!
              </p>
              <p className="text-text-primary text-sm font-normal">
                Get 100% fee rebates on Gnosis for every swap into bCSPX, bTSLA
                via Bungee{" "}
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
  );
};

export default PromotionBanner;
