"use client";
import AppButton from "@/components/app-button";
import AppCheckbox from "@/components/app-checkbox";
import AppImage from "@/components/app-image";
import AppLoading from "@/components/app-loading";
import AppProgress from "@/components/app-progress";
import AppTabs from "@/components/app-tabs";
import AppTextarea from "@/components/app-textarea";
import { useAppDispatch } from "@/libs/hooks";
import { setUser } from "@/libs/slices/userSlice";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const TradingView = dynamic(() => import("@/components/app-trading-view"), {
  ssr: false,
});

const ComponentPage = () => {
  const [activeTab, setActiveTab] = useState<string>("1");
  const dispatch = useAppDispatch();
  return (
    <div className="w-[50%] m-auto">
      <div className="my-5">
        <AppProgress percent={50} />
      </div>
      <div className="my-5">
        <AppTabs
          items={[
            {
              label: "Tab 1",
              key: "1",
              children: <div>1</div>,
            },
            {
              label: "Tab 2",
              key: "2",
              children: <div>2</div>,
            },
          ]}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <div className="my-5">
        <AppTextarea />
      </div>
      <div className="my-5">
        <AppButton typeButton="outline" size="middle">
          outline
        </AppButton>
        <AppButton typeButton="primary" size="small">
          primary
        </AppButton>
        <AppButton typeButton="secondary">secondary</AppButton>
      </div>
      <div className="my-5">
        <AppCheckbox />
      </div>
      <div className="my-5">
        <AppLoading />
      </div>
      <div className="my-5">
        <AppImage />
      </div>
      {/* <div className="my-5">
        <AppDropdown />
      </div> */}

      <TradingView />
    </div>
  );
};

export default ComponentPage;
