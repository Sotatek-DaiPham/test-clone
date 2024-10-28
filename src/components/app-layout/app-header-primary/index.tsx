"use client";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import { PATH_ROUTER } from "@/constant/router";
import useWindowSize from "@/hooks/useWindowSize";
import { Hamburgericon, RainmakrIcon } from "@public/assets";
import { Flex, Layout } from "antd";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AppMenu from "../app-menu";

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
  const { isDesktop } = useWindowSize();
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLAnchorElement>(null);

  const pageTitle = routeTitles[pathname];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !toggleButtonRef.current?.contains(event.target as Node)
      ) {
        setIsOpenMenuMobile(false);
      }
    };

    if (isOpenMenuMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMenuMobile]);

  useEffect(() => {
    setIsOpenMenuMobile(false);
  }, [pathname]);

  return (
    <Header
      className={`flex items-center pr-4 pl-0 z-50 ${
        !isDesktop
          ? "fixed top-0 left-0 right-0 z-50 bg-neutral-2 h-14"
          : "bg-transparent py-6 h-auto"
      }`}
    >
      {!isDesktop ? (
        <div className="mr-auto h-full flex items-center">
          <a
            className={clsx(
              "p-4 w-14 h-14",
              isOpenMenuMobile ? "bg-primary-main" : ""
            )}
            ref={toggleButtonRef}
            onClick={() => setIsOpenMenuMobile((prevState) => !prevState)}
          >
            {isOpenMenuMobile ? (
              <Image
                src={Hamburgericon}
                alt="close icon"
                className="filter-white"
              />
            ) : (
              <Image src={Hamburgericon} alt="close icon" />
            )}
          </a>

          <Link href="/" className={isOpenMenuMobile ? "ml-2" : ""}>
            <Image
              src={RainmakrIcon}
              alt="rainmakr icon"
              width={84}
              height={24}
              className="my-auto"
            />
          </Link>

          {/* Sidebar Overlay */}
          <div
            className={`fixed top-14 inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isOpenMenuMobile ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          ></div>
          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed top-14 left-0 p-6 h-full w-[90%] bg-neutral-2 shadow-lg transform transition-transform duration-300 overflow-y-auto ${
              isOpenMenuMobile ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Flex vertical>
              <AppMenu className="bg-neutral-2 !p-0" />
            </Flex>
          </div>
        </div>
      ) : (
        <h5 className="text-32px-bold text-white ml-6">{pageTitle}</h5>
      )}
      <div className="ml-auto flex items-center">
        <ConnectWalletButton />
      </div>
    </Header>
  );
}
