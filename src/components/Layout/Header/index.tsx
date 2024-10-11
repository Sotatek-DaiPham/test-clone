"use client";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import useWindowSize from "@/hooks/useWindowSize";
import { CloseIcon, Hamburgericon } from "@public/assets";
import { Flex, Layout } from "antd";
import Image from "next/image";
import { useState } from "react";
import AppMenu from "../Menu";
import "./styles.scss";

const { Header } = Layout;

export default function AppHeader() {
  const { isMobile } = useWindowSize();
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);

  return (
    <Header className="app-header">
      <Flex align="center" justify="center" className="app-header__left">
        <h1 className="text-2xl font-bold text-white">RainPump</h1>
      </Flex>
      <Flex className="app-header__right" align="center" justify="end" gap={24}>
        {isMobile ? (
          <>
            <a
              className="ant-dropdown-link"
              onClick={() => setIsOpenMenuMobile((prevState) => !prevState)}
            >
              {isOpenMenuMobile ? (
                <Image src={CloseIcon} alt="close icon" />
              ) : (
                <Image src={Hamburgericon} alt="close icon" />
              )}
            </a>
            {isOpenMenuMobile ? (
              <div className="main-navbar-mobile">
                <Flex vertical>
                  <ConnectWalletButton />
                  <AppMenu className="navbar-menu-mobile" />
                </Flex>
              </div>
            ) : null}
          </>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Header>
  );
}
