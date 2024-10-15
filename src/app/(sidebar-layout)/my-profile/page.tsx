"use client";
import AppTabs from "@/components/app-tabs";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import {
  DollarCircleUpIcon,
  FollowersIcon,
  FollowingIcon,
  MyProfileIcon,
  MyRepliesIcon,
  NotificationsIcon,
  PortfolioIcon,
} from "@public/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CoinCreatedTab from "./components/Tabs/CoinCreated";
import FollowersTab from "./components/Tabs/Followers";
import FollowingTab from "./components/Tabs/Following";
import MyProfileTab from "./components/Tabs/MyProfileTab";
import MyRepliesTab from "./components/Tabs/MyReplies";
import NotificationsTab from "./components/Tabs/NotificationsTab";
import PortfolioTab from "./components/Tabs/PortfolioTab";

enum ETabsMyProfile {
  MY_PROFILE = "my-profile",
  PORTFOLIO = "portfolio",
  COIN_CREATED = "coin-created",
  FOLLOWERS = "followers",
  FOLLOWING = "following",
  MY_REPLIES = "my-replies",
  NOTIFICATIONS = "notifications",
}

const MyProfilePage = () => {
  const { address: userAddress } = useAccount();
  const { searchParams, setSearchParams } = useAppSearchParams("myProfile");
  const [activeTab, setActiveTab] = useState<string>(ETabsMyProfile.MY_PROFILE);

  const tabs = [
    {
      label: "My profile",
      key: ETabsMyProfile.MY_PROFILE,
      children: <MyProfileTab walletAddress={userAddress as string} />,
      icon: <Image src={MyProfileIcon} alt="my-profile" />,
    },
    {
      label: "Portfolio",
      key: ETabsMyProfile.PORTFOLIO,
      children: <PortfolioTab walletAddress={userAddress as string} />,
      icon: <Image src={PortfolioIcon} alt="my-portfolio" />,
    },
    {
      label: "Coin created",
      key: ETabsMyProfile.COIN_CREATED,
      children: <CoinCreatedTab walletAddress={userAddress as string} />,
      icon: <Image src={DollarCircleUpIcon} alt="coin-created" />,
    },
    {
      label: "Followers",
      key: ETabsMyProfile.FOLLOWERS,
      children: <FollowersTab walletAddress={userAddress as string} />,
      icon: <Image src={FollowersIcon} alt="followers" />,
    },
    {
      label: "Following",
      key: ETabsMyProfile.FOLLOWING,
      children: <FollowingTab walletAddress={userAddress as string} />,
      icon: <Image src={FollowingIcon} alt="following" />,
    },
    {
      label: "My replies",
      key: ETabsMyProfile.MY_REPLIES,
      children: <MyRepliesTab />,
      icon: <Image src={MyRepliesIcon} alt="my-replies" />,
    },
    {
      label: "Notifications",
      key: ETabsMyProfile.NOTIFICATIONS,
      children: <NotificationsTab />,
      icon: <Image src={NotificationsIcon} alt="notifications" />,
    },
  ];

  useEffect(() => {
    switch (searchParams?.tab) {
      case ETabsMyProfile.MY_PROFILE:
        return setActiveTab(ETabsMyProfile.MY_PROFILE);
      case ETabsMyProfile.PORTFOLIO:
        return setActiveTab(ETabsMyProfile.PORTFOLIO);
      case ETabsMyProfile.COIN_CREATED:
        return setActiveTab(ETabsMyProfile.COIN_CREATED);
      case ETabsMyProfile.FOLLOWERS:
        return setActiveTab(ETabsMyProfile.FOLLOWERS);
      case ETabsMyProfile.FOLLOWING:
        return setActiveTab(ETabsMyProfile.FOLLOWING);
      case ETabsMyProfile.MY_REPLIES:
        return setActiveTab(ETabsMyProfile.MY_REPLIES);
      case ETabsMyProfile.NOTIFICATIONS:
        return setActiveTab(ETabsMyProfile.NOTIFICATIONS);

      default:
        return;
    }
  }, []);

  const handleChangeTab = (value: any) => {
    setActiveTab(value);
    setSearchParams({
      tab: value,
    });
  };

  return (
    <div className="m-auto max-w-[var(--width-content-sidebar-layout)]">
      <AppTabs
        items={tabs}
        className="app-tabs-primary"
        activeKey={activeTab}
        onChange={handleChangeTab}
      />
    </div>
  );
};

export default MyProfilePage;
