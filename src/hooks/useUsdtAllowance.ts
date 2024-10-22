import { usdtABI } from "@/abi/usdtAbi";
import { USDT_DECIMAL } from "@/constant";
import { envs } from "@/constant/envs";
import BigNumber from "bignumber.js";
import { useReadContract } from "wagmi";

const useUsdtAllowance = (userAddress: any) => {
  const { data, ...rest } = useReadContract({
    abi: usdtABI,
    address: envs.USDT_ADDRESS as any,
    functionName: "allowance",
    args: [userAddress, envs.TOKEN_FACTORY_ADDRESS],
  });

  return {
    allowance: BigNumber(data as string)
      .div(USDT_DECIMAL)
      .toString(),
    ...rest,
  };
};

export default useUsdtAllowance;
