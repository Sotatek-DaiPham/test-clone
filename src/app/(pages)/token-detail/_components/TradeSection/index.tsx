import { useState } from "react";
import AppInputBalance from "@/components/app-input/app-input-balance";
import ButtonContained from "@/components/Button/ButtonContained";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { EthIcon, SettingIcon } from "@/assets/icons";
import { Tabs, TabsProps } from "antd";
import Image from "next/image";
import AppAmountSelect from "@/components/app-amount-select";
import "./styles.scss";
import TradeSettingModal from "@/components/app-modal/app-setting-modal";

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
        <div className="text-16px-medium text-gray-500">
          {tabKey === TabKey.BUY ? "Buy Amount" : "Sell Amount"}
        </div>
        <div className="text-sm text-gray-400">
          Minimum amount: <span className="text-white"> 0.01 ETH</span>
        </div>
      </div>
      <AppInputBalance
        tokenImageSrc={EthIcon}
        tokenSymbol="ETH"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        regex={REGEX_INPUT_DECIMAL()}
      />
      <AppAmountSelect numbers={predefinedNumbers} onSelect={handleSelect} />
      <div className="text-sm text-gray-400">
        You will receive <span className="text-white">0 ABC</span>
      </div>
      <div className="flex gap-2 items-center w-full">
        <ButtonContained fullWidth>
          {tabKey === TabKey.BUY ? "Buy" : "Sell"}
        </ButtonContained>
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
