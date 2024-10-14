import { Layout } from "antd";
import Image from "next/image";
import { RainmakrIcon } from "@public/assets";
import AppMenu from "../app-menu";
import Link from "next/link";

const { Sider } = Layout;

export default function AppSidebar() {
  return (
    <Sider width={260} className="bg-neutral-2">
      <div className="flex justify-center mt-6 mb-10">
        <Link href="/">
          <Image src={RainmakrIcon} alt="rainmakr icon" />
        </Link>
      </div>
      <AppMenu />
    </Sider>
  );
}
