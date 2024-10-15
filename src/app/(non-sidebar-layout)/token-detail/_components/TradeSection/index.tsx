import { useState } from "react";
import AppAmountSelect from "@/components/app-amount-select";
import AppButton from "@/components/app-button";
import AppInputBalance from "@/components/app-input/app-input-balance";
import TradeSettingModal from "@/components/app-modal/app-setting-modal";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { EthIcon, SettingIcon } from "@public/assets";
import { Tabs, TabsProps } from "antd";
import Image from "next/image";
import "./styles.scss";

enum TabKey {
  BUY = "buy",
  SELL = "sell",
}

const TradeTab = ({ tabKey }: { tabKey: TabKey }) => {
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const predefinedNumbers = [0.1, 0.5, 1, 2, 5];

  const handleSelect = (value: number) => {
    setInputValue(value.toString());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-14px-normal text-neutral-7">
          {tabKey === TabKey.BUY ? "Buy Amount" : "Sell Amount"}
        </div>
        <div className="text-14px-normal text-neutral-7">
          Minimum amount:{" "}
          <span className="text-white-neutral text-14px-medium"> 0.01 ETH</span>
        </div>
      </div>
      <AppInputBalance
        tokenImageSrc={EthIcon}
        tokenSymbol="ETH"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        regex={REGEX_INPUT_DECIMAL()}
        isSwap
      />
      <AppAmountSelect numbers={predefinedNumbers} onSelect={handleSelect} />
      <div className="text-14px-normal text-neutral-7">
        You will receive{" "}
        <span className="text-white-neutral text-14px-medium">0 ABC</span>
      </div>
      <div className="flex gap-2 items-center w-full">
        <AppButton widthFull>
          {tabKey === TabKey.BUY ? "Buy" : "Sell"}
        </AppButton>
        <Image
          className="cursor-pointer"
          src={SettingIcon}
          alt="setting"
          width={40}
          height={40}
          onClick={() => setOpenSettingModal(true)}
        />
      </div>
      <TradeSettingModal
        open={openSettingModal}
        onCancel={() => setOpenSettingModal(false)}
        onOk={() => setOpenSettingModal(false)}
      />
    </div>
  );
};

const TradeSection = () => {
  const items: TabsProps["items"] = [
    {
      key: TabKey.BUY,
      label: "Buy",
      children: <TradeTab tabKey={TabKey.BUY} />,
    },
    {
      key: TabKey.SELL,
      label: "Sell",
      children: <TradeTab tabKey={TabKey.SELL} />,
    },
  ];

  return (
    <div className="trade-section">
      <Tabs defaultActiveKey="buy" items={items} />
    </div>
  );
};

export default TradeSection;
