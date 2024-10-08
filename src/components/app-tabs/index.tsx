"use client";
import { Tabs, TabsProps } from "antd";
import "./style.scss";

interface ITabsProps extends TabsProps {
  customClassName?: string;
  operations?: React.ReactNode;
}

const AppTabs = ({ customClassName, operations, ...props }: ITabsProps) => {
  return (
    <Tabs
      className={`app-tabs ${customClassName}`}
      {...props}
      tabBarExtraContent={operations}
    />
  );
};

export default AppTabs;
