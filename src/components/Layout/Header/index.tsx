"use client";
import { Memeicon } from "../../../../public/assets";
import { Flex, Layout } from "antd";
import Image from "next/image";
import "./styles.scss";
import ConnectWalletButton from "@/components/Button/ConnectWallet";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="app-header">
      <Flex className="app-header-left" gap={16} align="center">
        <Image
          className="app-header-logo"
          src={Memeicon}
          alt="logo"
          width={32}
          height={32}
        />
        <h1 className="app-header-title">RainMakr Meme Coin</h1>
      </Flex>
      <ConnectWalletButton />
    </Header>
  );
};

export default AppHeader;
