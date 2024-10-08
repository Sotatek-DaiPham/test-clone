import withClient from "@/helpers/with-client";
import Progress, { ProgressProps } from "antd/es/progress";
import clsx from "clsx";
import "./style.scss";

interface Props extends ProgressProps {
  className?: string;
}

function AppProcess(props: Props) {
  const { className, rootClassName, ...restProps } = props;

  return <Progress className={clsx("app-process", className)} {...restProps} />;
}

export default withClient(AppProcess);
