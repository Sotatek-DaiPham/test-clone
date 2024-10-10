"use client";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "./Header";
import useWindowSize from "@/hooks/useWindowSize";
import AppSidebar from "./Sidebar";
import useWalletAuth from "@/hooks/useWalletAuth";
import LoginModal from "../app-modal/app-login-modal";
import { watchAccount } from "wagmi/actions";
import { config } from "@/wagmi";
import { useAppDispatch } from "@/libs/hooks";
import { clearUser } from "@/libs/slices/userSlice";
import "./styles.scss";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useWindowSize();
  const dispatch = useAppDispatch();
  const [isOpenWarningModal, setIsOpenWarningModal] = useState(false);
  const {
    login,
    accessToken: isAuth,
    isConnected,
    isLoginLoading,
    logout,
  } = useWalletAuth();

  useEffect(() => {
    if (isConnected && !isAuth) {
      const inner = setTimeout(() => {
        setIsOpenWarningModal(true);
      }, 1000);

      return () => {
        clearTimeout(inner);
      };
    }
  }, [isConnected, isAuth]);

  useEffect(() => {
    const unwatchAccount = watchAccount(config, {
      onChange(data, previousAccount) {
        if (
          data.status === "connected" &&
          previousAccount?.address !== data?.address
        ) {
          dispatch(clearUser());
        }
      },
    });
    return () => {
      unwatchAccount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout className="app-layout">
      <AppHeader />
      <Layout className="main-layout">
        {!isMobile ? <AppSidebar /> : null}
        <Content className="app-content">{children}</Content>
        <LoginModal
          onOk={() => {
            login(
              () => {
                setIsOpenWarningModal(false);
              },
              () => {
                setIsOpenWarningModal(false);
                logout();
              }
            );
          }}
          open={isOpenWarningModal}
          onCancel={() => {
            setIsOpenWarningModal(false);
            logout();
          }}
          title="Signature required"
          content="Please sign on your wallet to confirm"
          loading={isLoginLoading}
        />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
