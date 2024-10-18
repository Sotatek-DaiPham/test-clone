import { useEffect } from "react";
import useWalletAuth from "@/hooks/useWalletAuth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex } from "antd";
import ButtonContained from "../ButtonContained";
import { shortenAddress } from "@/helpers/shorten";
import "./styles.scss";

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
          (!authenticationStatus || authenticationStatus === "authenticated") &&
          accessToken;
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
                  className="flex-col md:flex-row flex-1 md:flex-auto"
                >
                  {/* <ButtonContained
                    buttonType="secondary"
                    className="pointer-events-none"
                  >
                    {chain.name}
                  </ButtonContained> */}

                  <Flex
                    className="wallet-info"
                    align="center"
                    onClick={openAccountModal}
                  >
                    <Flex
                      className="wallet-info__token"
                      gap={10}
                      align="center"
                    >
                      {chain.hasIcon && (
                        <div
                          className="wallet-info__token__icon"
                          style={{
                            background: chain.iconBackground,
                          }}
                        >
                          {chain.iconUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 32, height: 32 }}
                            />
                          )}
                        </div>
                      )}
                      <div className="wallet-info__token__balance">
                        {account.displayBalance
                          ? ` ${account.displayBalance}`
                          : ""}
                      </div>
                    </Flex>

                    <div className="wallet-info__address">
                      {shortenAddress(account.address, 6, -3)}
                    </div>
                  </Flex>
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
