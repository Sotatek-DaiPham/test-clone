import { usdtABI } from "@/abi/usdtAbi";
import { TOKEN_DECIMAL } from "@/constant";
import BigNumber from "bignumber.js";
import { useReadContract } from "wagmi";

const useTokenBalance = (userAddress: any, contractAddress: any) => {
  const { data, ...rest } = useReadContract({
    abi: usdtABI,
    address: contractAddress,
    functionName: "balanceOf",
    args: [userAddress],
    query: {
      enabled: !!userAddress && !!contractAddress,
    },
  });

  return {
    balance: BigNumber(data as string)
      .div(TOKEN_DECIMAL)
      .toString(),
    ...rest,
  };
};

export default useTokenBalance;
