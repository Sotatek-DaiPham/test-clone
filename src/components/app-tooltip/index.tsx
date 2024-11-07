import { TooltipIcon } from "@public/assets";
import { Tooltip } from "antd";
import { TooltipPropsWithOverlay } from "antd/es/tooltip";
import Image from "next/image";

interface ITooltipProps extends TooltipPropsWithOverlay {
  overlayClassName?: string;
}

const AppTooltip = ({ children, ...props }: ITooltipProps) => {
  return (
    <Tooltip
      overlayClassName={`app-tooltip app-tooltip-ellipsis ${props.overlayClassName || ""}`}
      {...props}
    >
      {/* {children || <Image src={TooltipIcon} alt="tooltip-icon" />} */}
      {children}
    </Tooltip>
  );
};

export default AppTooltip;
