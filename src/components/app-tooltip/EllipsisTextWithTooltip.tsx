import { TooltipProps, Typography } from "antd";

import { TypographyProps } from "antd/lib";

export interface IEllipsisTextWithTooltipProps
  extends Partial<TypographyProps> {
  value: React.ReactNode;
  displayValue?: React.ReactNode;
  width?: string | number;
  maxWidth?: string | number;
  className?: string;
  tooltipProps?: TooltipProps;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function TextWithLineBreaks({ text }: any) {
  // Replace '\n' with '<br>' tags
  const htmlContent = text.replace(/\n/g, "<br>");

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

const EllipsisTextWithTooltip: React.FC<IEllipsisTextWithTooltipProps> = ({
  value,
  displayValue,
  width,
  maxWidth,
  className,
  tooltipProps,
  style,
  onClick,
  ...rest
}: IEllipsisTextWithTooltipProps) => {
  return (
    <Typography.Text
      onClick={onClick}
      className={`font-sfPro ${className ?? ""}`}
      ellipsis={{
        tooltip: {
          color: "var(--color-icon-secondary)",
          title: <TextWithLineBreaks text={value} />,
          trigger: "hover",
          ...tooltipProps,
        },
      }}
      style={{ width: width, maxWidth: maxWidth, ...style }}
      {...rest}
    >
      {displayValue ? displayValue : value ?? "-"}
    </Typography.Text>
  );
};

export default EllipsisTextWithTooltip;
