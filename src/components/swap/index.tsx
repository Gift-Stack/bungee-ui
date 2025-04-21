import PromotionBanner from "../banners/promotion";
import SwapForm from "./form";
import QuoteRefetchButton from "./quote-refetch-button";

export default function SwapInterface() {
  return (
    <div className="relative w-[420px]">
      <div className="bg-layer-1 p-4 min-w-[360px] relative overflow-hidden border border-solid border-border-dark w-full rounded-2xl">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-text-primary text-xl font-semibold">Swap</p>
            <div className="flex items-center space-x-2">
              <QuoteRefetchButton />
            </div>
          </div>

          <SwapForm />
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

      <PromotionBanner />
    </div>
  );
}
