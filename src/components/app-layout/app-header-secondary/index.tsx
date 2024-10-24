"use client";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import useWindowSize from "@/hooks/useWindowSize";
import { CloseIcon, Hamburgericon, RainmakrIcon } from "@public/assets";
import { Flex, Layout } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AppMenu from "../app-menu";
import "./styles.scss";

const { Header } = Layout;

export default function AppHeaderSecondary() {
  const { isDesktop } = useWindowSize();
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);

  return (
    <Header
      className={`bg-neutral-2 flex p-y-4 px-10 justify-between h-[72px] border-b-[1px] border-solid border-b-neutral-4 ${
        !isDesktop ? "fixed top-0 left-0 right-0 z-50 bg-neutral-2" : ""
      }`}
    >
      <Flex align="center" justify="center">
        <Link href="/">
          <Image src={RainmakrIcon} alt="rainmakr icon" />
        </Link>
      </Flex>
      <Flex align="center" justify="end" gap={24}>
        {!isDesktop ? (
          <>
            <a
              className="flex items-center"
              onClick={() => setIsOpenMenuMobile((prevState) => !prevState)}
            >
              {isOpenMenuMobile ? (
                <Image src={CloseIcon} alt="close icon" />
              ) : (
                <Image src={Hamburgericon} alt="close icon" />
              )}
            </a>
            {isOpenMenuMobile ? (
              <div className="app-header-secondary-mobile">
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
