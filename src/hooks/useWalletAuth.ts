import { API_PATH } from "@/constant/api-path";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { clearUser, setUser } from "@/libs/slices/userSlice";
import { postAPI } from "@/service";
import { useMutation } from "@tanstack/react-query";
import { UserRejectedRequestError } from "viem";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

type TConnectWallet = {
  signature: string;
  address: string;
  role: "USER";
};

const useWalletAuth = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const { chainId, address: userAddress, isConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { signMessageAsync, isPending: isSignMessageLoading } =
    useSignMessage();
  const { mutateAsync: connectWalletAPI, isPending: isSignInLoading } =
    useMutation({
      mutationFn: (data: TConnectWallet) => {
        return postAPI(API_PATH.AUTH.CONNECT_WALLET, data);
      },
    });

  const logout = () => {
    dispatch(clearUser());
    disconnectWallet();
  };

  const login = async (onSuccess?: () => void, onError?: () => void) => {
    try {
      const signature = await signMessageAsync({
        message: process.env.NEXT_PUBLIC_SIGN_MESSAGE as string,
      });

      if (userAddress && signature) {
        const res = await connectWalletAPI({
          signature,
          address: userAddress,
          role: "USER",
        });

        const { access_token: accessToken } = res?.data || {};

        console.log({ res });

        dispatch(setUser({ accessToken, address: userAddress }));
      }

      onSuccess?.();
    } catch (error) {
      if (error instanceof UserRejectedRequestError) {
        onError?.();
      }
    }
  };

  return {
    chainId,
    userAddress,
    isConnected,
    disconnectWallet,
    login,
    logout,
    accessToken,
  };
};

export default useWalletAuth;
