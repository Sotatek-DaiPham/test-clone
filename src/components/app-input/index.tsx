import { Input, InputProps } from "antd";
import { ChangeEvent } from "react";
import "./style.scss";
import Image from "next/image";
import { SearchIcon } from "@public/assets";

interface IAppInputProps extends InputProps {
  className?: string;
  isSearch?: boolean;
  iconPosition?: "left" | "right";
}

const AppInput = ({
  className,
  isSearch,
  iconPosition = "left",
  ...restProps
}: IAppInputProps) => {
  const searchIcon = isSearch ? <Image src={SearchIcon} alt="search" /> : null;

  return (
    <Input
      className={`app-input ${className || ""}`}
      allowClear={true}
      suffix={isSearch && iconPosition === "right" ? searchIcon : null}
      prefix={isSearch && iconPosition === "left" ? searchIcon : null}
      {...restProps}
    />
  );
};

export default AppInput;
