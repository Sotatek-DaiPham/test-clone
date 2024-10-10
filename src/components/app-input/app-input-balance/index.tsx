import { Input, InputProps } from "antd";
import Image from "next/image";
import { ChangeEvent } from "react";
import "./styles.scss";

interface Props extends InputProps {
  tokenSymbol: string;
  tokenImageSrc?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  regex?: RegExp;
}

const AppInputBalance = ({
  tokenImageSrc,
  tokenSymbol,
  value,
  onChange,
  regex,
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
      <div className="token-balance-input__token">
        {tokenImageSrc && (
          <Image alt="token" width={30} height={30} src={tokenImageSrc} />
        )}
        <span>{tokenSymbol}</span>
      </div>

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
