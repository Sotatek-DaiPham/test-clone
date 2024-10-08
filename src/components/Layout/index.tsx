"use client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "./Header";
import useWindowSize from "@/hooks/useWindowSize";
import AppSidebar from "./Sidebar";
import "./styles.scss";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useWindowSize();
  return (
    <Layout className="app-layout">
      <AppHeader />
      <Layout className="main-layout">
        {!isMobile ? <AppSidebar /> : null}
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
