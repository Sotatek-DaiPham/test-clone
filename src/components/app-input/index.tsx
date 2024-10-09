import { Input, InputProps } from "antd";
import Image from "next/image";
import { SearchIcon } from "@public/assets";
import { TextAreaProps } from "antd/es/input";
import "./style.scss";

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
      suffix={isSearch && iconPosition === "right" ? searchIcon : null}
      prefix={isSearch && iconPosition === "left" ? searchIcon : null}
      {...restProps}
    />
  );
};

AppInput.TextArea = (props: TextAreaProps) => (
  <Input.TextArea className="app-input" {...props} />
);

export default AppInput;
