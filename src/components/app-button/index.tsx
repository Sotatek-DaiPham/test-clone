import withClient from "@/helpers/with-client";
import { Button, ButtonProps } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import clsx from "clsx";
import { ReactNode } from "react";
import "./style.scss";

interface AppButtonProps extends ButtonProps {
  children: ReactNode | string;
  customClass?: string;
  isActive?: boolean;
  size?: SizeType;
  typeButton?: "default" | "outline" | "secondary" | "primary";
  widthFull?: boolean;
  classChildren?: string;
}

const AppButton = ({
  children,
  customClass,
  isActive = false,
  size = "middle",
  typeButton = "default",
  widthFull,
  classChildren,
  ...props
}: AppButtonProps) => {
  return (
    <Button
      className={clsx(
        "app-button w-full text-text-primary-2",
        typeButton,
        size,
        customClass ?? ""
      )}
      {...props}
    >
      <span
        className={`font-[700] text-[14px] ${widthFull ? "w-full" : ""} ${
          classChildren ?? ""
        }`}
      >
        {children}
      </span>
    </Button>
  );
};
export default withClient(AppButton);
