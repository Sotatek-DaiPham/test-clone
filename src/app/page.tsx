"use client";
import { Button } from "antd";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/slices/userSlice";

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
    </>
  );
}
