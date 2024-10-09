import { Flex, Tooltip, TooltipProps } from "antd";

interface Props {
  label: string;
  isRequired?: boolean;
  tooltipInfo?: {
    title: React.ReactNode;
    tooltipIconProps?: React.SVGProps<SVGSVGElement>;
    tooltipProps?: TooltipProps;
  };
}

const FormItemLabel = ({ label, isRequired, tooltipInfo }: Props) => {
  return (
    <Flex align="center" gap={4} className="text-white text-14px-medium">
      {label} {isRequired ? <span>*</span> : ""}
      {tooltipInfo ? (
        <Tooltip title={tooltipInfo?.title} {...tooltipInfo.tooltipProps} />
      ) : null}
    </Flex>
  );
};

export default FormItemLabel;
