"use client";
import AppTabs from "@/components/app-tabs";
import isProfilePage from "@/helpers/isProfilePage";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import {
  DollarCircleUpIcon,
  FollowersIcon,
  FollowingIcon,
  MyProfileIcon,
  PortfolioIcon,
} from "@public/assets";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CoinCreatedTab from "../../_components/Tabs/CoinCreated";
import FollowersTab from "../../_components/Tabs/Followers";
import FollowingTab from "../../_components/Tabs/Following";
import MyProfileTab from "../../_components/Tabs/MyProfileTab";
import PortfolioTab from "../../_components/Tabs/PortfolioTab";
import { ETabsMyProfile } from "../../my-profile/page";

const UserProfilePage = () => {
  const { id } = useParams();
  const { searchParams, setSearchParams } = useAppSearchParams("myProfile");
  const [activeTab, setActiveTab] = useState<string>(ETabsMyProfile.MY_PROFILE);

  const tabs = [
    {
      label: "Profile",
      key: ETabsMyProfile.MY_PROFILE,
      children: <MyProfileTab walletAddress={id as string} />,
      icon: <Image src={MyProfileIcon} alt="profile" />,
    },
    {
      label: "Portfolio",
      key: ETabsMyProfile.PORTFOLIO,
      children: <PortfolioTab walletAddress={id as string} />,
      icon: <Image src={PortfolioIcon} alt="portfolio" />,
    },
    {
      label: "Coin created",
      key: ETabsMyProfile.COIN_CREATED,
      children: <CoinCreatedTab walletAddress={id as string} />,
      icon: <Image src={DollarCircleUpIcon} alt="coin-created" />,
    },
    {
      label: "Followers",
      key: ETabsMyProfile.FOLLOWERS,
      children: <FollowersTab walletAddress={id as string} />,
      icon: <Image src={FollowersIcon} alt="followers" />,
    },
    {
      label: "Following",
      key: ETabsMyProfile.FOLLOWING,
      children: <FollowingTab walletAddress={id as string} />,
      icon: <Image src={FollowingIcon} alt="following" />,
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

export default isProfilePage(UserProfilePage);
