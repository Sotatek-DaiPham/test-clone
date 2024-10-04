import useWalletAuth from "@/hooks/useWalletAuth";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Flex } from "antd";
import ButtonContained from "../ButtonContained";
import { shortenAddress } from "@/helpers/shorten";
import { useEffect } from "react";

const ConnectWalletButton = () => {
  const { userAddress, isConnected, accessToken, logout } = useWalletAuth();

  useEffect(() => {
    if (!isConnected) {
      const inner = setTimeout(() => {
        logout();
      }, 300);
      return () => {
        clearTimeout(inner);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, userAddress]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <Flex
            align="center"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <ButtonContained
                    onClick={openConnectModal}
                    buttonType="primary"
                    fullWidth
                  >
                    Connect Wallet
                  </ButtonContained>
                );
              }

              if (chain.unsupported) {
                return (
                  <ButtonContained onClick={openChainModal} type="primary">
                    Wrong network
                  </ButtonContained>
                );
              }

              return (
                <Flex
                  align="center"
                  justify="center"
                  gap={12}
                  className="button-group"
                >
                  {/* <ButtonContained
                    onClick={openChainModal}
                    buttonType="secondary"
                  >
                    {chain.name}
                  </ButtonContained> */}

                  <ButtonContained
                    onClick={openAccountModal}
                    buttonType="secondary"
                  >
                    {shortenAddress(account.address, 4, -4)}
                  </ButtonContained>
                </Flex>
              );
            })()}
          </Flex>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
