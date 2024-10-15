import AppHeaderSecondary from "../app-header-secondary";
import { Content } from "antd/es/layout/layout";
import Image from "next/image";
import { BackgounrdEffect4, BackgounrdEffect5 } from "@public/assets";

export default function AppLayoutSecondary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeaderSecondary />
      <Content className="relative p-10">
        <div className="relative z-[2]">{children}</div>
        <Image
          className="absolute left-[-2%] top-[-52px] scale-[0.8]"
          src={BackgounrdEffect4}
          alt="effect"
        />
        <Image
          className="absolute right-[13%] top-[10%] scale-[0.8]"
          src={BackgounrdEffect5}
          alt="effect"
        />
      </Content>
    </>
  );
}
