import AppLayout from "@/components/Layout";
import { NotificationProvider } from "@/libs/antd/NotificationProvider";
import SocketProvider from "@/libs/socket/SocketProvider";
import { WagmiRainbowKitProvider } from "@/providers/WagmiProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DM_Sans } from "next/font/google";
import "@/assets/scss/globals.scss";
// import "@/app/globals.scss";

const ReduxProviders = dynamic(() => import("@/providers/StoreProvider"), {
  ssr: false,
});

const DMSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
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
      <body className={DMSans.variable}>
        <ReduxProviders>
          <WagmiRainbowKitProvider>
            <AntdRegistry>
              <AppLayout>
                <SocketProvider>
                  <NotificationProvider>{children}</NotificationProvider>
                </SocketProvider>
              </AppLayout>
            </AntdRegistry>
          </WagmiRainbowKitProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
