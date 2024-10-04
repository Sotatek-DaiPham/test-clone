import { Layout } from "antd";
import Header from "./Header";
import { Content } from "antd/es/layout/layout";
import Footer from "./Footer";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">{children}</Content>
      <Footer />
    </Layout>
  );
};

export default AppLayout;
