import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import dynamic from "next/dynamic";
import AppLayout from "@/components/Layout";
import { WagmiRainbowKitProvider } from "@/providers/WagmiProvider";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import SocketProvider from "@/libs/socket/SocketProvider";

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
                <SocketProvider>{children}</SocketProvider>
              </AppLayout>
            </AntdRegistry>
          </WagmiRainbowKitProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
