"use client";
import AppTabs from "@/components/app-tabs";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { useEffect, useState } from "react";
import PortfolioTab from "./components/Tabs/PortfolioTab";
import MyProfileTab from "./components/Tabs/MyProfileTab";
import NotificationsTab from "./components/Tabs/NotificationsTab";
import MyRepliesTab from "./components/Tabs/MyReplies";
import FollowingTab from "./components/Tabs/Following";
import FollowersTab from "./components/Tabs/Followers";
import CoinCreatedTab from "./components/Tabs/CoinCreated";

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
  const { searchParams, setSearchParams } = useAppSearchParams("myProfile");
  const [activeTab, setActiveTab] = useState<string>(ETabsMyProfile.MY_PROFILE);

  const tabs = [
    {
      label: "My profile",
      key: ETabsMyProfile.MY_PROFILE,
      children: <MyProfileTab />,
    },
    {
      label: "Portfolio",
      key: ETabsMyProfile.PORTFOLIO,
      children: <PortfolioTab />,
    },
    {
      label: "Coin created",
      key: ETabsMyProfile.COIN_CREATED,
      children: <CoinCreatedTab />,
    },
    {
      label: "Followers",
      key: ETabsMyProfile.FOLLOWERS,
      children: <FollowersTab />,
    },
    {
      label: "Following",
      key: ETabsMyProfile.FOLLOWING,
      children: <FollowingTab />,
    },
    {
      label: "My replies",
      key: ETabsMyProfile.MY_REPLIES,
      children: <MyRepliesTab />,
    },
    {
      label: "Notifications",
      key: ETabsMyProfile.NOTIFICATIONS,
      children: <NotificationsTab />,
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
