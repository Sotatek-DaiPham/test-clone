"use client";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import { PATH_ROUTER } from "@/constant/router";
import useWindowSize from "@/hooks/useWindowSize";
import { CloseIcon, Hamburgericon } from "@public/assets";
import { Flex, Layout } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AppMenu from "../app-menu";
import "./styles.scss";

const { Header } = Layout;

const routeTitles: { [key: string]: string } = {
  [PATH_ROUTER.DASHBOARD]: "",
  [PATH_ROUTER.MY_PROFILE]: "My Profile",
  [PATH_ROUTER.MY_TOKENS]: "My Tokens",
  [PATH_ROUTER.NOTIFICATION]: "Notification",
  [PATH_ROUTER.LEADER_BOARD]: "RainPump Leaderboard",
  [PATH_ROUTER.CREATE_TOKEN]: "Create A New Coin",
};

export default function AppHeaderPrimary() {
  const { isMobile } = useWindowSize();
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);
  const pathname = usePathname();

  const pageTitle = routeTitles[pathname];
  return (
    <Header
      className={` flex p-6 h-auto ${
        isMobile
          ? "fixed top-0 left-0 right-0 z-50 bg-neutral-2"
          : "bg-transparent"
      }`}
    >
      <h5 className="text-32px-bold text-white">{pageTitle}</h5>
      <div className="ml-auto flex items-center">
        {isMobile ? (
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
              <div className="app-header-primary-mobile">
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
      </div>
    </Header>
  );
}
