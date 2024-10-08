import { DropDownProps, Dropdown } from "antd";
import "./style.scss";

interface AppDropdownProps extends DropDownProps {
  className?: string;
}

const AppDropdown = ({ children, className, ...props }: AppDropdownProps) => {
  return (
    <Dropdown rootClassName={`app-dropdown ${className}`} {...props}>
      {children}
    </Dropdown>
  );
};

export default AppDropdown;
