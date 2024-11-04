import "@/assets/scss/globals.scss";
import AppLayout from "@/components/app-layout";
import { NotificationProvider } from "@/libs/antd/NotificationProvider";
import SocketProvider from "@/libs/socket/SocketProvider";
import { WagmiRainbowKitProvider } from "@/providers/WagmiProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReduxProviders = dynamic(() => import("@/providers/StoreProvider"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "RainMakr MemeCoin",
  description: "RainMakr MemeCoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProviders>
          <WagmiRainbowKitProvider>
            <AntdRegistry>
              <NotificationProvider>
                <AppLayout>
                  <SocketProvider>{children}</SocketProvider>
                </AppLayout>
              </NotificationProvider>
            </AntdRegistry>
          </WagmiRainbowKitProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
