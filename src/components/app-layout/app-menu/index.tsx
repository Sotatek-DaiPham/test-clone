"use client";
import { PATH_ROUTER } from "@/constant/router";
import {
  BrowseIcon,
  CoinsIcon,
  LeaderboardIcon,
  ProfileIcon,
  TelegramIcon,
  XIcon,
} from "@public/assets";
import { Menu, MenuProps } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import "./styles.scss";

type MenuItem = Required<MenuProps>["items"][number];

interface AppMenuProps {
  className?: string;
}
export default function AppMenu({ className }: AppMenuProps) {
  // const selectedSegment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const router = useRouter();
  // Split the pathname to get segments
  const segments = pathname.split("/").filter(Boolean);
  const selectedSegment = segments.length > 0 ? segments[0] : "";

  const items: MenuItem[] = [
    {
      label: "Browser",
      key: PATH_ROUTER.DASHBOARD,
      onClick: () => {
        router.push(PATH_ROUTER.DASHBOARD);
      },
      icon: <Image src={BrowseIcon} alt="menu icon" />,
    },
    {
      label: "Start a new coin",
      key: PATH_ROUTER.CREATE_TOKEN,
      icon: <Image src={CoinsIcon} alt="menu icon" />,
      onClick: () => {
        router.push(PATH_ROUTER.CREATE_TOKEN);
      },
    },
    {
      label: "My Portfolio",
      key: PATH_ROUTER.MY_PROFILE,
      icon: <Image src={ProfileIcon} alt="menu icon" />,
      onClick: () => {
        router.push(PATH_ROUTER.MY_PROFILE);
      },
    },
    {
      label: "Leaderboard",
      key: PATH_ROUTER.LEADER_BOARD,
      icon: <Image src={LeaderboardIcon} alt="menu icon" />,
      onClick: () => {
        router.push(PATH_ROUTER.LEADER_BOARD);
      },
    },
    {
      type: "divider",
    },
    {
      label: "X",
      key: "x",
      icon: <Image src={XIcon} alt="menu icon" />,
    },
    {
      label: "Telegram",
      key: "telegram",
      icon: <Image src={TelegramIcon} alt="menu icon" />,
    },
  ];

  return (
    <Menu
      mode="inline"
      style={{ height: "100%", borderRight: 0 }}
      items={items}
      selectedKeys={[`/${selectedSegment}`]}
      className={`app-menu ${className || ""}`}
    />
  );
}
