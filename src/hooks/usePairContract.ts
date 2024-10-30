// src/hooks/usePairContract.ts

import { uniswapPairAbi } from "@/abi/uniswapPairContract";
import { TOKEN_DECIMAL, USDT_DECIMAL } from "@/constant";
import BigNumber from "bignumber.js";
import { useReadContract } from "wagmi";

const usePairContract = (pairAddress: string | null) => {
  const { data: token0Address } = useReadContract({
    address: pairAddress as any,
    abi: uniswapPairAbi,
    functionName: "token0",
    query: {
      enabled: !!pairAddress,
    },
  });

  const { data: token1Address } = useReadContract({
    address: pairAddress as any,
    abi: uniswapPairAbi,
    functionName: "token1",
    query: {
      enabled: !!pairAddress,
    },
  });

  const { data: token0Decimal } = useReadContract({
    address: token0Address as any,
    abi: uniswapPairAbi,
    functionName: "decimals",
    query: {
      enabled: !!token0Address,
    },
  });

  const { data: token1Decimal } = useReadContract({
    address: token1Address as any,
    abi: uniswapPairAbi,
    functionName: "decimals",
    query: {
      enabled: !!token1Address,
    },
  });

  const { data: reserveData } = useReadContract({
    address: pairAddress as any,
    abi: uniswapPairAbi,
    functionName: "getReserves",
    query: {
      enabled: !!pairAddress,
    },
  });

  const [memeTokenAddress, usdtAddress] =
    token0Decimal === 18
      ? [token0Address, token1Address]
      : [token1Address, token0Address];

  const [memeTokenReserveIndex, usdtReserveIndex] =
    token0Decimal === 18 ? [0, 1] : [1, 0];

  return {
    memeTokenReserve: BigNumber(
      (reserveData as any[])?.[memeTokenReserveIndex] as number
    ).div(TOKEN_DECIMAL),
    usdtReserve: BigNumber(
      (reserveData as any[])?.[usdtReserveIndex] as number
    ).div(USDT_DECIMAL),
    memeTokenAddress,
    usdtAddress,
  };
};

export default usePairContract;
