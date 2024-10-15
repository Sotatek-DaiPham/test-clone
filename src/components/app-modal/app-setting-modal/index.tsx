import ButtonContained from "@/components/Button/ButtonContained";
import AppAmountSelect from "@/components/app-amount-select";
import AppCheckbox from "@/components/app-checkbox";
import AppInputBalance from "@/components/app-input/app-input-balance";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { EthIcon, UsdtIcon } from "@public/assets";
import { ModalProps } from "antd";
import { useState } from "react";
import AppModal from "..";
import "./styles.scss";
import AppButton from "@/components/app-button";

interface ITradeSettingModal extends ModalProps {
  onOk: () => void;
}

const TradeSettingModal = ({ title, onOk, ...props }: ITradeSettingModal) => {
  const [slippage, setSlippage] = useState("");
  const [priorityFee, setPriorityFee] = useState("");
  const predefinedNumbers = [0.1, 0.5, 1, 2, 5];

  return (
    <AppModal
      className="trade-setting-modal"
      width={500}
      footer={false}
      centered
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="text-26px-bold text-white-neutral">Trade Setting</div>
        <div className="bg-neutral-1 p-6 rounded-[12px] flex items-start gap-2">
          <AppCheckbox />
          <div>
            <div className="text-16px-medium text-neutral-9">
              Front running protection
            </div>
            <div className="text-14px-normal text-neutral-7">
              Front-running protection prevents sandwich attacks on your swaps.
              With this feature enabled you can safely use high slippage.
            </div>
          </div>
        </div>
        <div className="bg-neutral-1 p-6 rounded-[12px] flex flex-col gap-2">
          <label className="text-14px-medium text-neutral-7">
            Max Slippage
          </label>
          <AppInputBalance
            tokenSymbol="Slippage (%)"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            regex={REGEX_INPUT_DECIMAL()}
          />
          <AppAmountSelect
            numbers={predefinedNumbers}
            onSelect={(value) => setSlippage(value.toString())}
          />
          <div className="text-14px-normal text-neutral-7">
            This is the maximum amount of slippage you are willing to accept
            when placing trades
          </div>
        </div>
        <div className="bg-neutral-1 p-6 rounded-[12px] flex flex-col gap-2">
          <label className="text-14px-medium text-neutral-7">
            Priority fee
          </label>
          <AppInputBalance
            value={priorityFee}
            tokenImageSrc={UsdtIcon}
            tokenSymbol="USDT"
            onChange={(e) => setPriorityFee(e.target.value)}
            regex={REGEX_INPUT_DECIMAL()}
          />
          <AppAmountSelect
            numbers={predefinedNumbers}
            onSelect={(value) => setSlippage(value.toString())}
          />
          <div className="text-14px-normal text-neutral-7">
            A higher priority fee will speed up the confirmation of your
            transactions.
          </div>
        </div>
        <AppButton widthFull>Apply</AppButton>
      </div>
    </AppModal>
  );
};

export default TradeSettingModal;
