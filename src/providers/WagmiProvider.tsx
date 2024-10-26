"use client";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { WagmiProvider } from "wagmi";
import { merge } from "lodash";
import { config } from "../wagmi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const myCustomTheme: Theme = merge(darkTheme(), {
  colors: {
    accentColor: "#ff57c4",
    modalBackground: "#373738",
  },
  fonts: {
    body: "SF Pro",
  },
});
export function WagmiRainbowKitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myCustomTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
