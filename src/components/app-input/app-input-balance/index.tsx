import { SelectDropdownIcon, UsdtIcon } from "@public/assets";
import { Input, InputProps, Select } from "antd";
import Image from "next/image";
import { ChangeEvent } from "react";
import "./styles.scss";

interface Props extends InputProps {
  tokenSymbol: string;
  tokenImageSrc?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
            defaultValue="ETH"
            suffixIcon={
              <Image src={SelectDropdownIcon} alt="Select dropdown icon" />
            }
            popupClassName="token-balance-input__select"
          >
            <Select.Option value={tokenSymbol}>
              <div className="flex items-center gap-1">
                {tokenImageSrc && (
                  <Image
                    alt="token"
                    width={20}
                    height={20}
                    src={tokenImageSrc}
                  />
                )}
                <span className="text-neutral-9 text-16px-medium">
                  {tokenSymbol}
                </span>
              </div>
            </Select.Option>
            <Select.Option value="usdt">
              <div className="flex items-center gap-1">
                <Image alt="token" width={20} height={20} src={UsdtIcon} />
                <span className="text-neutral-9 text-16px-medium">
                  {tokenSymbol}
                </span>
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
