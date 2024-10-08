"use client";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { setUser } from "@/libs/slices/userSlice";
import dynamic from "next/dynamic";

const TradingView = dynamic(() => import("@/components/app-trading-view"), {
  ssr: false,
});

export default function Home() {
  const accessToken = useAppSelector((state: any) => state.user.accessToken);
  const dispatch = useAppDispatch();
  console.log("accessToken", accessToken);
  return (
    <div className="h-full">
      <span className="text-26px-bold text-primary-white">
        RainMakr Meme Coin
      </span>
      <h1>RainMakr Meme Coin</h1>
      <h1 className="text-26px-bold text-primary-white">sy</h1>

      <span className="text-26px-bold text-gray-1">RainMakr Meme Coin</span>

      <p>{process.env.NEXT_PUBLIC_ENDPOINT_URL}</p>
      <Button
        onClick={() => {
          dispatch(
            setUser({
              accessToken: "accessToken",
              address: "address",
            })
          );
        }}
      >
        Test Redux
      </Button>
      <TradingView />
    </div>
  );
}
