import { TagType } from "@/constants";
import { RequiredFieldIcon } from "@/constants/icons";
// import withClient from "@/helpers/with-client";
import Input, { InputProps } from "antd/es/input/Input";
import clsx from "clsx";
import { forwardRef, ReactNode } from "react";
import AppTag from "../app-tag";
import "./style.scss";

interface Props extends Omit<InputProps, "title"> {
  title?: string | ReactNode;
  tag?: string;
  required?: boolean;
  className?: string;
  rootClassName?: string;
  typeTag?: TagType;
}

const AppInput = forwardRef<HTMLInputElement, Props>(function AppInput(
  props: Props,
  ref: any
) {
  const {
    className,
    rootClassName,
    title,
    required,
    tag,
    size = "middle",
    typeTag,
    ...restProps
  } = props;
  return (
    <div className={clsx("app-input", rootClassName)}>
      {title && (
        <div className="w-full flex items-center justify-between mb-1.5">
          <div className="text-14px-normal text-text-secondary flex flex-row items-center">
            <span>{title}</span>
            {required && <RequiredFieldIcon className="ml-1" />}
          </div>
          {tag && <AppTag type={typeTag || TagType.Primary}>{tag}</AppTag>}
        </div>
      )}
      <Input ref={ref} className={className} size={size} {...restProps} />
    </div>
  );
});
export default AppInput;
