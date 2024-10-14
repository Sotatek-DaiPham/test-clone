"use client";

import PriceSection from "../_components/PriceSection";
import TradeSection from "../_components/TradeSection";

const TokenDetailPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-[65%] order-1 lg:order-1 gap-4">
        {/* Trading view section */}
        <div className="bg-white p-4">
          <h1 className="text-2xl  font-bold">Trading View</h1>
        </div>

        {/* Tab list section */}
        <div className="bg-white p-4 mt-8">
          <h1 className="text-2xl  font-bold">Trade History</h1>
        </div>
      </div>

      <div className="w-full lg:w-[35%] order-2 lg:order-2 gap-4">
        {/* Buy/Sell section */}
        <div className="p-4 mb-4">
          <TradeSection />
        </div>

        {/* Detail information section */}
        <div>
          <PriceSection />
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;
