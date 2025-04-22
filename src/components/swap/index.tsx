import PromotionBanner from "../banners/promotion";
import SwapForm from "./form";

export default function SwapInterface() {
  return (
    <div className="relative md:w-[420px]">
      <div className="bg-layer-1 p-4 min-w-[360px] relative overflow-hidden border border-solid border-border-dark w-full rounded-2xl">
        <SwapForm />
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
