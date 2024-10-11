import AppProgress from "@/components/app-progress";
import AppTooltip from "@/components/app-tooltip";

const PriceSection = () => {
  return (
    <div className="bg-[#23262f] border border-[#353945] rounded-2xl shadow-lg p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-16px-medium text-gray-500">Price</div>
        <div className="text-16px-medium text-[#FF8F57]">$ 12.000</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-16px-medium text-gray-500">Market Cap</div>
        <div className="text-16px-medium text-[#FF8F57]">$ 2.000</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-16px-medium text-gray-500">
            Bonding curve progress
          </div>
          <AppTooltip title="When the market cap reaches $60.000 all the liquidity from the bonding curve will be deposited into Uniswap." />
        </div>
        <div className="text-16px-medium text-[#FF8F57]">40%</div>
      </div>
      <AppProgress percent={40} strokeColor="#FF8F57" />
    </div>
  );
};

export default PriceSection;
