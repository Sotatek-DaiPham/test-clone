import { routerContactAbi } from "@/abi/routerContract";
import { usdtABI } from "@/abi/usdtAbi";
import AppAmountSelect from "@/components/app-amount-select";
import AppButton from "@/components/app-button";
import AppInputBalance from "@/components/app-input/app-input-balance";
import ConfirmModal from "@/components/app-modal/app-confirm-modal";
import TradeSettingModal from "@/components/app-modal/app-setting-modal";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import {
  AMOUNT_FIELD_NAME,
  ErrorCode,
  MINIMUM_BUY_AMOUNT,
  PREDEFINE_AMOUNT,
  PREDEFINE_SELL_PERCENT,
  TOKEN_DECIMAL,
  USDT_DECIMAL,
} from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { envs } from "@/constant/envs";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { useTokenDetail } from "@/context/TokenDetailContext";
import { BeSuccessResponse } from "@/entities/response";
import {
  calculateTokenReceiveAfterListed,
  calculateUsdtShouldPayAfterListed,
  decreaseByPercent,
  swapToken1ForToken2,
} from "@/helpers/calculate";
import { nFormatter } from "@/helpers/formatNumber";
import usePairContract from "@/hooks/usePairContract";
import useTokenBalance from "@/hooks/useTokenBalance";
import { ECoinType } from "@/interfaces/token";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { useAppSelector } from "@/libs/hooks";
import { postAPI } from "@/service";
import { useContract } from "@/web3/contracts/useContract";
import { SettingIcon } from "@public/assets";
import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import { useReadContract } from "wagmi";
import { TabKey, useTradeSettings } from "..";

export const SETTINGS_FIELD_NAMES = {
  FONT_RUNNING: "fontRunning",
  SLIPPAGE: "slippage",
  PRIORITY_FEE: "priorityFee",
} as const;

export interface FormSetting {
  [SETTINGS_FIELD_NAMES.FONT_RUNNING]: boolean;
  [SETTINGS_FIELD_NAMES.SLIPPAGE]: string;
  [SETTINGS_FIELD_NAMES.PRIORITY_FEE]: string;
}

const CONTRACT_ROUTER = envs.CONTRACT_ROUTER_ADDRESS;

const amountValidator = (value: string, usdtShouldPay: string) => {
  const amount = Number(value);
  if (
    (value && BigNumber(amount).lt(MINIMUM_BUY_AMOUNT)) ||
    (usdtShouldPay && BigNumber(usdtShouldPay).lt(MINIMUM_BUY_AMOUNT))
  ) {
    return Promise.reject(
      new Error(`Minimum transaction amount is ${MINIMUM_BUY_AMOUNT} USDT`)
    );
  }
  return Promise.resolve();
};

const TradeTabAfterListed = ({ tabKey }: { tabKey: TabKey }) => {
  const { accessToken: isAuthenticated, address } = useAppSelector(
    (state) => state.user
  );
  const { error, success } = useContext(NotificationContext);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [formSetting] = Form.useForm<FormSetting>();
  const [form] = Form.useForm<{ amount: string }>();
  const { tokenDetail, refetch } = useTokenDetail();
  const [loadingStatus, setLoadingStatus] = useState({
    buyToken: false,
    sellToken: false,
    approve: false,
  });

  const { tradeSettings } = useTradeSettings();

  const { mutateAsync: confirmHash } = useMutation({
    mutationFn: (
      hash: string
    ): Promise<AxiosResponse<BeSuccessResponse<any>>> => {
      return postAPI(API_PATH.TRADING.CONFIRM(hash));
    },
    onError: (err) => {},
    mutationKey: ["confirm-hash"],
  });

  const { memeTokenAddress, usdtAddress, memeTokenReserve, usdtReserve } =
    usePairContract(tokenDetail?.pairListDex);

  const { data: memeTokenAllowance } = useReadContract({
    abi: usdtABI,
    address: memeTokenAddress as any,
    functionName: "allowance",
    args: [address, CONTRACT_ROUTER],
  });

  const { data: usdtAllowance } = useReadContract({
    abi: usdtABI,
    address: usdtAddress as any,
    functionName: "allowance",
    args: [address, CONTRACT_ROUTER],
  });
  const [coinType, setCoinType] = useState(ECoinType.StableCoin);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const USDTContract = useContract(usdtABI, usdtAddress as string);
  const MemeTokenContract = useContract(usdtABI, memeTokenAddress as string);

  const routerContract = useContract(routerContactAbi, CONTRACT_ROUTER);

  const amountValue = useWatch(AMOUNT_FIELD_NAME, form);

  const { balance, refetch: refetchUserBalance } = useTokenBalance(
    address,
    memeTokenAddress
  );

  const usdtShouldPay: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.MemeCoin) {
      return calculateUsdtShouldPayAfterListed(
        memeTokenReserve,
        usdtReserve,
        amountValue
      );
    } else {
      return "";
    }
  }, [amountValue, tabKey, coinType]);

  const tokenWillReceive: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.StableCoin) {
      return calculateTokenReceiveAfterListed(
        memeTokenReserve,
        usdtReserve,
        amountValue
      );
    } else {
      return "";
    }
  }, [amountValue, tabKey, coinType]);

  const sellAmountOut: any = useMemo(() => {
    if (amountValue) {
      return swapToken1ForToken2(
        memeTokenReserve,
        usdtReserve,
        BigNumber(amountValue)
      );
    } else {
      return "";
    }
  }, [amountValue, tabKey, coinType]);

  const usdtAmount =
    coinType === ECoinType.MemeCoin
      ? BigNumber(usdtShouldPay)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_CEIL)
          .dividedBy(USDT_DECIMAL)
          .toFixed(6)
      : amountValue;

  const isDisableBuyButton =
    !amountValue ||
    !!(amountValue && BigNumber(amountValue).lt(MINIMUM_BUY_AMOUNT)) ||
    !!(usdtShouldPay && BigNumber(usdtShouldPay).lt(MINIMUM_BUY_AMOUNT));

  const handleSelect = (value: string) => {
    form.setFieldValue(AMOUNT_FIELD_NAME, value);
  };

  const handleSelectSellPercent = (value: string) => {
    const cleaned = value.replace("%", "");
    const percentNumber = parseFloat(cleaned);

    const sellValue = BigNumber(balance)
      .multipliedBy(BigNumber(percentNumber).div(100))
      .toFixed(2);
    if (Number(balance)) {
      form.setFieldValue(AMOUNT_FIELD_NAME, sellValue);
    } else {
      return;
    }
  };

  const handleTransactionSuccess = () => {
    form.resetFields();
    setIsOpenApproveModal(false);
    refetchUserBalance();
    refetch();
    success({
      message: "Transaction completed",
      key: "1",
    });
  };

  const handleApproveUsdt = async () => {
    const contract = await USDTContract;

    const approveAmount =
      coinType === ECoinType.MemeCoin ? usdtShouldPay : amountValue;

    setLoadingStatus((prev) => ({ ...prev, approve: true }));
    try {
      console.log(
        "Approve params",
        CONTRACT_ROUTER,
        BigNumber(approveAmount).multipliedBy(USDT_DECIMAL).toFixed(0)
      );
      const txn = await contract?.approve(
        CONTRACT_ROUTER,
        BigNumber(approveAmount).multipliedBy(USDT_DECIMAL).toFixed(0)
      );

      await txn?.wait();
      await handleSwapToken();

      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    } catch (e: any) {
      setLoadingStatus((prev) => ({
        ...prev,
        approve: false,
        buyToken: false,
      }));
      handleError(e);
    } finally {
      setIsOpenApproveModal(false);
    }
  };

  const handleApproveToken = async () => {
    const contract = await MemeTokenContract;

    setLoadingStatus((prev) => ({ ...prev, approve: true }));

    try {
      console.log(
        "Approve params",
        CONTRACT_ROUTER,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed()
      );
      const txn = await contract?.approve(
        CONTRACT_ROUTER,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed()
      );

      await txn?.wait();
      await handleSwapToken();

      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    } catch (e: any) {
      console.log({ e });
      setLoadingStatus((prev) => ({
        ...prev,
        approve: false,
        sellToken: false,
      }));
      handleError(e);
    } finally {
      setIsOpenApproveModal(false);
    }
  };
  const renderAmountInOut = () => {
    if (tabKey === TabKey.BUY) {
      return (
        <div className="text-16px-normal text-neutral-7">
          {coinType === ECoinType.MemeCoin
            ? "You must pay "
            : "You will receive "}
          <span className="text-white-neutral text-16px-medium">
            {" "}
            {coinType === ECoinType.MemeCoin
              ? `${nFormatter(usdtShouldPay) || 0} USDT`
              : `${nFormatter(tokenWillReceive) || 0} ${tokenDetail?.symbol}`}
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-16px-normal text-neutral-7">
          You will receive
          <span className="text-white-neutral text-16px-medium">
            {" "}
            {`${nFormatter(sellAmountOut) || 0} USDT`}
          </span>
        </div>
      );
    }
  };

  const getSwapAmount = () => {
    return tabKey === TabKey.BUY
      ? coinType === ECoinType.MemeCoin
        ? BigNumber(usdtShouldPay).multipliedBy(USDT_DECIMAL).toFixed(0)
        : BigNumber(amountValue).multipliedBy(USDT_DECIMAL).toFixed(0)
      : BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed();
  };

  const getMinTokenOut = () => {
    return Number(tradeSettings?.slippage)
      ? tabKey === TabKey.BUY
        ? coinType === ECoinType.MemeCoin
          ? decreaseByPercent(amountValue, tradeSettings?.slippage)
          : decreaseByPercent(tokenWillReceive, tradeSettings?.slippage)
        : decreaseByPercent(sellAmountOut, tradeSettings?.slippage)
      : 0;
  };

  const getSwapPath = () => {
    return tabKey === TabKey.BUY
      ? [usdtAddress, memeTokenAddress]
      : [memeTokenAddress, usdtAddress];
  };

  const handleError = (e: any) => {
    if (e?.code === ErrorCode.MetamaskDeniedTx) {
      error({
        message: "Transaction denied",
      });
      return;
    }

    if (e?.action === "estimateGas") {
      error({
        message: "Insufficient fee",
      });
      return;
    }

    if (e) {
      error({
        message: "Transaction Error",
      });
    }
  };

  const handleSwapToken = async () => {
    if (tabKey === TabKey.BUY) {
      setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    } else {
      setLoadingStatus((prev) => ({ ...prev, sellToken: true }));
    }
    const contract = await routerContract;

    const gasLimit = Number(tradeSettings?.priorityFee)
      ? BigNumber(tradeSettings?.priorityFee).multipliedBy(1e10).toString()
      : 0;

    const swapAmount = getSwapAmount();
    const minTokenOut = getMinTokenOut();

    const path = getSwapPath();

    console.log(
      "Swap Params",
      swapAmount,
      BigNumber(minTokenOut)
        .multipliedBy(tabKey === TabKey.BUY ? TOKEN_DECIMAL : USDT_DECIMAL)
        .toFixed(0),
      path,
      address,
      address,
      9999999999999
    );

    try {
      const tx =
        await contract?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          swapAmount,
          BigNumber(minTokenOut)
            .multipliedBy(tabKey === TabKey.BUY ? TOKEN_DECIMAL : USDT_DECIMAL)
            .toFixed(0),
          path,
          address,
          address,
          9999999999999,
          {
            gasLimit: gasLimit || undefined,
          }
        );

      await tx.wait();
      const txHash = tx?.hash;
      await confirmHash(txHash);
      handleTransactionSuccess();
      if (tabKey === TabKey.BUY) {
        setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
      } else {
        refetchUserBalance();
        setLoadingStatus((prev) => ({ ...prev, sellToken: false }));
      }
    } catch (e: any) {
      console.log({ e });
      if (tabKey === TabKey.BUY) {
        setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
      } else {
        setLoadingStatus((prev) => ({ ...prev, sellToken: false }));
      }
      handleError(e);
    }
  };

  const handleBuyToken = async () => {
    let needApprove;
    if (coinType === ECoinType.MemeCoin) {
      needApprove = BigNumber(usdtShouldPay).gt(
        (usdtAllowance as string) ?? "0"
      );
    } else {
      needApprove = BigNumber(amountValue)
        .multipliedBy(USDT_DECIMAL)
        .gt((usdtAllowance as string) ?? "0");
    }

    if (needApprove && tabKey === TabKey.BUY) {
      setIsOpenApproveModal(true);
      return;
    }

    await handleSwapToken();
  };

  const handleSellToken = async () => {
    const needApprove = BigNumber(amountValue).gt(
      (memeTokenAllowance as string) ?? "0"
    );

    if (needApprove) {
      setIsOpenApproveModal(true);
      return;
    }

    await handleSwapToken();
  };

  useEffect(() => {
    if (usdtAmount || sellAmountOut) {
      form.validateFields();
    }
  }, [usdtAmount, sellAmountOut]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-14px-normal text-neutral-7">
          {tabKey === TabKey.BUY ? "Buy Amount" : "Sell Amount"}
        </div>
        <div className="text-14px-normal text-neutral-7">
          Minimum amount:{" "}
          <span className="text-white-neutral text-14px-medium">
            {" "}
            {MINIMUM_BUY_AMOUNT} USDT
          </span>
        </div>
      </div>
      <Form
        form={form}
        initialValues={{
          amount: "",
        }}
      >
        <Form.Item
          name={AMOUNT_FIELD_NAME}
          rules={[
            {
              validator: (_: any, value: string) =>
                amountValidator(
                  value,
                  tabKey === TabKey.BUY ? usdtAmount : sellAmountOut
                ),
            },
          ]}
        >
          {tabKey === TabKey.BUY ? (
            <AppInputBalance
              tokenImageSrc={tokenDetail?.avatar}
              tokenSymbol={tokenDetail?.symbol}
              onTokenChange={(token) => setCoinType(token)}
              regex={REGEX_INPUT_DECIMAL(0, 6)}
              placeholder="Enter buy amount"
              isSwap
            />
          ) : (
            <AppInputBalance
              tokenImageSrc={tokenDetail?.avatar}
              tokenSymbol={tokenDetail?.symbol}
              regex={REGEX_INPUT_DECIMAL(0, 6)}
              placeholder="Enter sell amount"
            />
          )}
        </Form.Item>
      </Form>
      {tabKey === TabKey.BUY ? (
        coinType === ECoinType.StableCoin ? (
          <AppAmountSelect numbers={PREDEFINE_AMOUNT} onSelect={handleSelect} />
        ) : null
      ) : (
        <AppAmountSelect
          numbers={PREDEFINE_SELL_PERCENT}
          onSelect={handleSelectSellPercent}
        />
      )}

      {renderAmountInOut()}

      <div className="flex gap-2 items-center w-full">
        {isAuthenticated ? (
          tabKey === TabKey.BUY ? (
            <AppButton
              customClass="w-full"
              onClick={handleBuyToken}
              loading={loadingStatus.buyToken || loadingStatus.approve}
              disabled={isDisableBuyButton}
            >
              Buy
            </AppButton>
          ) : (
            <AppButton
              customClass="w-full"
              onClick={handleSellToken}
              loading={loadingStatus.sellToken}
              disabled={!amountValue}
            >
              Sell
            </AppButton>
          )
        ) : (
          <ConnectWalletButton customClass="flex-1" />
        )}
        <Image
          className="cursor-pointer"
          src={SettingIcon}
          alt="setting"
          width={40}
          height={40}
          onClick={() => setOpenSettingModal(true)}
        />
      </div>
      <TradeSettingModal
        open={openSettingModal}
        onClose={() => {
          setOpenSettingModal(false);
        }}
        onOk={() => setOpenSettingModal(false)}
        form={formSetting}
      />
      <ConfirmModal
        title="You need to approve your tokens in order to make transaction"
        onOkText="Approve"
        open={isOpenApproveModal}
        loading={loadingStatus.approve}
        onOk={tabKey === TabKey.BUY ? handleApproveUsdt : handleApproveToken}
        onCancel={() => {
          setIsOpenApproveModal(false);
          setLoadingStatus((prev) => ({ ...prev, approve: false }));
        }}
      />
    </div>
  );
};

export default TradeTabAfterListed;
