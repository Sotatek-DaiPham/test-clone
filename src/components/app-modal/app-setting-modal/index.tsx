import ButtonContained from "@/components/Button/ButtonContained";
import AppAmountSelect from "@/components/app-amount-select";
import AppCheckbox from "@/components/app-checkbox";
import AppInputBalance from "@/components/app-input/app-input-balance";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { EthIcon } from "@public/assets";
import { ModalProps } from "antd";
import { useState } from "react";
import AppModal from "..";
import "./styles.scss";

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
        <div className="text-18px-medium text-white  mt-5">Trade Setting</div>
        <div className="bg-[#1a1c21] p-4 rounded-lg flex items-center gap-2">
          <AppCheckbox />
          <div>
            <div className="text-16px-medium text-white">
              Front running protection
            </div>
            <div className="text-16px-sm text-gray-500">
              Front-running protection prevents sandwich attacks on your swaps.
              With this feature enabled you can safely use high slippage.
            </div>
          </div>
        </div>
        <div className="bg-[#1a1c21] p-4 rounded-lg flex flex-col gap-2">
          <label className="text-16px-medium text-white">Max Slippage</label>
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
          <div className="text-16px-sm text-gray-500">
            This is the maximum amount of slippage you are willing to accept
            when placing trades
          </div>
        </div>
        <div className="bg-[#1a1c21] p-4 rounded-lg flex flex-col gap-2">
          <label className="text-16px-medium text-white">Priority fee</label>
          <AppInputBalance
            value={priorityFee}
            tokenImageSrc={EthIcon}
            tokenSymbol="ETH"
            onChange={(e) => setPriorityFee(e.target.value)}
            regex={REGEX_INPUT_DECIMAL()}
          />
          <AppAmountSelect
            numbers={predefinedNumbers}
            onSelect={(value) => setSlippage(value.toString())}
          />
          <div className="text-16px-sm text-gray-500">
            A higher priority fee will speed up the confirmation of your
            transactions.
          </div>
        </div>
        <ButtonContained fullWidth>Apply</ButtonContained>
      </div>
    </AppModal>
  );
};

export default TradeSettingModal;
