import { Tooltip } from "antd";
import { TooltipPropsWithOverlay } from "antd/es/tooltip";

interface ITooltipProps extends TooltipPropsWithOverlay {}

const AppTooltip = ({ children, ...props }: ITooltipProps) => {
  return (
    <Tooltip
      color={"var(--color-icon-secondary)"}
      overlayInnerStyle={{ borderRadius: "2px" }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default AppTooltip;
