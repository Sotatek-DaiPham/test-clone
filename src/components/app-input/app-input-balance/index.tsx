import { ECoinType } from "@/interfaces/token";
import { SelectDropdownIcon, UsdtIcon } from "@public/assets";
import { Form, Input, InputProps, Select } from "antd";
import Image, { StaticImageData } from "next/image";
import { ChangeEvent } from "react";
import "./styles.scss";

interface Props extends InputProps {
  tokenSymbol: string;
  tokenImageSrc?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onTokenChange?: (token: ECoinType) => void;
  regex?: RegExp;
  isSwap?: boolean;
}

const AppInputBalance = ({
  tokenImageSrc,
  tokenSymbol,
  value,
  onChange,
  regex,
  isSwap,
  onTokenChange,
  ...restProps
}: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      onChange?.(e);
      return;
    }

    if (regex && !regex.test(value)) {
      return;
    }

    onChange?.(e);
  };

  return (
    <div className="token-balance-input">
      {isSwap ? (
        <div className="token-balance-input__token">
          <Select
            defaultValue={ECoinType.StableCoin}
            suffixIcon={
              <Image src={SelectDropdownIcon} alt="Select dropdown icon" />
            }
            popupClassName="select-token-modal"
            onChange={onTokenChange}
          >
            <Select.Option value={ECoinType.MemeCoin}>
              <div className="flex items-center gap-1">
                {tokenImageSrc && (
                  <Image
                    alt="token"
                    width={20}
                    height={20}
                    className="rounded-full object-cover h-5"
                    src={tokenImageSrc}
                  />
                )}
                <span className="text-neutral-9 text-16px-medium">
                  {tokenSymbol}
                </span>
              </div>
            </Select.Option>
            <Select.Option value={ECoinType.StableCoin}>
              <div className="flex items-center gap-1">
                <Image alt="token" width={20} height={20} src={UsdtIcon} />
                <span className="text-neutral-9 text-16px-medium">USDT</span>
              </div>
            </Select.Option>
          </Select>
        </div>
      ) : (
        <div className="token-balance-input__token p-2">
          {tokenImageSrc && (
            <Image alt="token" width={20} height={20} src={tokenImageSrc} />
          )}
          <span className="text-neutral-9 text-16px-medium">{tokenSymbol}</span>
        </div>
      )}

      <div className="token-balance-input__input">
        <Input
          autoComplete="off"
          value={value}
          onChange={handleChange}
          {...restProps}
        />
      </div>
    </div>
  );
};

export default AppInputBalance;
