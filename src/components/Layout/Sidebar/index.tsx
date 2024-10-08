import { Layout } from "antd";
import AppMenu from "../Menu";
import "./styles.scss";

const { Sider } = Layout;

export default function AppSidebar() {
  return (
    <Sider width={220}>
      <AppMenu />
    </Sider>
  );
}
