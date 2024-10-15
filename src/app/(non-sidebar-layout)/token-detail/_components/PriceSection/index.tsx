import AppProgress from "@/components/app-progress";
import AppTooltip from "@/components/app-tooltip";

const PriceSection = () => {
  return (
    <div className="bg-neutral-2 rounded-[16px] shadow-[0px_40px_32px_-24px_rgba(15,15,15,0.12)] p-5 flex flex-col gap-[15px]">
      <div className="flex justify-between items-center">
        <div className="text-14px-normal text-neutral-7">Price</div>
        <div className="text-14px-medium text-white-neutral">$ 12.000</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-14px-normal text-neutral-7">Market Cap</div>
        <div className="text-14px-medium text-white-neutral">$ 2.000</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-14px-normal text-neutral-7">
            Bonding curve progress
          </div>
          <AppTooltip title="When the market cap reaches $60.000 all the liquidity from the bonding curve will be deposited into Uniswap." />
        </div>
        <div className="text-14px-medium text-white-neutral">40%</div>
      </div>
      <AppProgress percent={40} strokeColor="#CBB2FF" />
    </div>
  );
};

export default PriceSection;
