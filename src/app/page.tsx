"use client";
import { Button } from "antd";
import { useAppDispatch } from "@/libs/hooks";
import { setUser } from "@/libs/slices/userSlice";
import dynamic from "next/dynamic";

const TradingView = dynamic(() => import("@/components/TradingView"), {
  ssr: false,
});

export default function Home() {
  const dispatch = useAppDispatch();
  return (
    <>
      <h1>RainMakr Meme Coin</h1>
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
    </>
  );
}
