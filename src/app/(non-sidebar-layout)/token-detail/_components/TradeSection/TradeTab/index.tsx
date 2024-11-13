import { pumpContractABI } from "@/abi/pumpContractAbi";
import { usdtABI } from "@/abi/usdtAbi";
import AppAmountSelect from "@/components/app-amount-select";
import AppButton from "@/components/app-button";
import AppInputBalance from "@/components/app-input/app-input-balance";
import ConfirmModal from "@/components/app-modal/app-confirm-modal";
import TradeSettingModal from "@/components/app-modal/app-setting-modal";
import AppNumberToolTip from "@/components/app-number-tooltip";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import {
  AMOUNT_FIELD_NAME,
  ErrorCode,
  MINIMUM_BUY_AMOUNT,
  PREDEFINE_AMOUNT,
  PREDEFINE_SELL_PERCENT,
  TOKEN_DECIMAL,
  USDT_DECIMAL,
  USDT_THRESHOLD,
  USDT_THRESHOLD_WITH_FEE,
} from "@/constant";
import { envs } from "@/constant/envs";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { useTokenDetail } from "@/context/TokenDetailContext";
import {
  calculateTokenReceive,
  calculateTokenReceiveWithoutFee,
  calculateUsdtShouldPay,
  decreaseByPercent,
  DISCOUNT_FACTOR,
  increaseByPercent,
} from "@/helpers/calculate";
import useCalculateAmount from "@/hooks/useCalculateAmount";
import useTokenBalance from "@/hooks/useTokenBalance";
import useUsdtAllowance from "@/hooks/useUsdtAllowance";
import { ECoinType } from "@/interfaces/token";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { useAppSelector } from "@/libs/hooks";
import { useContract } from "@/web3/contracts/useContract";
import { SettingIcon } from "@public/assets";
import { Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
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

const TradeTab = ({ tabKey }: { tabKey: TabKey }) => {
  const { accessToken: isAuthenticated, address } = useAppSelector(
    (state) => state.user
  );
  const { error, success } = useContext(NotificationContext);
  const { allowance, refetch: refetchAllownce } = useUsdtAllowance(address);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [formSetting] = Form.useForm<FormSetting>();
  const [form] = Form.useForm<{ amount: string }>();
  const {
    tokenDetail,
    refetchDetail,
    tokenDetailSC,
    refetch: refetchDetailSC,
  } = useTokenDetail();
  const [loadingStatus, setLoadingStatus] = useState({
    buyToken: false,
    sellToken: false,
    approve: false,
  });

  const {
    balance: userUSDTBalance,
    refetch: refetchUserUSDTBalance,
    isLoading: isLoadingUserUSDTBalance,
  } = useTokenBalance(address, envs.USDT_ADDRESS, USDT_DECIMAL);

  const { balance, refetch: refetchUserBalance } = useTokenBalance(
    address,
    tokenDetail?.contractAddress
  );
  const { tradeSettings } = useTradeSettings();

  const [coinType, setCoinType] = useState(ECoinType.StableCoin);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const USDTContract = useContract(usdtABI, envs.USDT_ADDRESS);
  const tokenFactoryContract = useContract(
    pumpContractABI,
    envs.TOKEN_FACTORY_ADDRESS || ""
  );

  const isTokenMint = !!tokenDetail?.contractAddress;

  const amountValue = useWatch(AMOUNT_FIELD_NAME, form);

  const availableToken = useMemo(() => {
    const tokenThreshold = calculateTokenReceiveWithoutFee(
      USDT_THRESHOLD.toString()
    );
    return BigNumber(tokenThreshold).minus(tokenDetailSC?.tokensSold || "0");
  }, [tokenDetailSC]);

  console.log("availableToken", availableToken.toString());

  const { amount: buyAmountOut } = useCalculateAmount({
    contractAddress: tokenDetail?.contractAddress,
    value: amountValue,
    decimalIn: USDT_DECIMAL,
    decimalOut: TOKEN_DECIMAL,
    functionName: "calculateBuyAmountOut",
    coinType: coinType,
  });

  const isExceedAvailableToken = useMemo(() => {
    if (coinType === ECoinType.MemeCoin) {
      return BigNumber(amountValue).gt(availableToken);
    } else {
      return BigNumber(buyAmountOut).gt(availableToken);
    }
  }, [amountValue, availableToken, coinType, buyAmountOut]);

  console.log("isExceedAvailableToken", isExceedAvailableToken);

  const { amount: buyAmountIn } = useCalculateAmount({
    contractAddress: tokenDetail?.contractAddress,
    value: isExceedAvailableToken
      ? BigNumber(availableToken).toFixed(6, BigNumber.ROUND_DOWN)
      : amountValue,
    decimalIn: TOKEN_DECIMAL,
    decimalOut: USDT_DECIMAL,
    functionName: "calculateBuyAmountIn",
    coinType: coinType,
  });

  const { amount: sellAmountOut, error: err } = useCalculateAmount({
    contractAddress: tokenDetail?.contractAddress,
    value: amountValue,
    decimalIn: TOKEN_DECIMAL,
    decimalOut: USDT_DECIMAL,
    functionName: "calculateSellAmountOut",
    coinType: coinType,
  });

  const usdtShouldPay: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.MemeCoin) {
      if (isTokenMint) {
        return buyAmountIn;
        // return isExceedAvailableToken ? USDT_THRESHOLD : buyAmountIn;
      } else {
        const calculatedUsdtShouldPay = calculateUsdtShouldPay(amountValue);
        return BigNumber(calculatedUsdtShouldPay).lt(0) ||
          !BigNumber(calculatedUsdtShouldPay).isFinite()
          ? USDT_THRESHOLD_WITH_FEE.toString()
          : calculatedUsdtShouldPay;
      }
    } else {
      return "";
    }
  }, [amountValue, buyAmountIn, isTokenMint, coinType]);

  const tokenWillReceive: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.StableCoin) {
      if (isTokenMint) {
        return isExceedAvailableToken
          ? BigNumber(availableToken).toFixed(6, BigNumber.ROUND_DOWN)
          : buyAmountOut;
      } else {
        const calculatedTokenWillReceive = calculateTokenReceive(amountValue);

        const maxTokenWillReceive = calculateTokenReceive(
          USDT_THRESHOLD_WITH_FEE.toString()
        );

        return BigNumber(amountValue).gt(USDT_THRESHOLD_WITH_FEE)
          ? maxTokenWillReceive
          : calculatedTokenWillReceive;
      }
    } else {
      return "";
    }
  }, [
    amountValue,
    buyAmountOut,
    isTokenMint,
    coinType,
    isExceedAvailableToken,
    availableToken,
  ]);

  const usdtAmount =
    coinType === ECoinType.MemeCoin
      ? BigNumber(usdtShouldPay).toFixed(6, BigNumber.ROUND_DOWN)
      : amountValue;

  const isDisableBuyButton =
    !amountValue ||
    !!(amountValue && BigNumber(amountValue).lt(MINIMUM_BUY_AMOUNT)) ||
    !!(usdtShouldPay && BigNumber(usdtShouldPay).lt(MINIMUM_BUY_AMOUNT));

  const isDisableSellButton =
    !isTokenMint ||
    !amountValue ||
    !!(sellAmountOut && BigNumber(sellAmountOut).lt(MINIMUM_BUY_AMOUNT));

  const handleSelect = (value: string) => {
    form.setFieldValue(AMOUNT_FIELD_NAME, value);
  };

  const handleSelectSellPercent = (value: string) => {
    const cleaned = value.replace("%", "");
    const percentNumber = parseFloat(cleaned);

    const sellValue = BigNumber(balance)
      .multipliedBy(BigNumber(percentNumber).div(100))
      .toFixed(6, BigNumber.ROUND_DOWN);
    if (BigNumber(balance).gt(0.000001)) {
      form.setFieldValue(AMOUNT_FIELD_NAME, sellValue);
    } else {
      return;
    }
  };

  const handleTransactionSuccess = () => {
    form.resetFields();
    setIsOpenApproveModal(false);
    refetchDetail();
    refetchUserUSDTBalance();
    refetchUserBalance();
    refetchAllownce();
    refetchDetailSC();
    success({
      message: "Transaction completed",
      key: "1",
    });
  };

  const handleCreateAndBuyToken = async () => {
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const contract = await tokenFactoryContract;
    const minTokenOut = Number(tradeSettings?.slippage)
      ? decreaseByPercent(
          coinType === ECoinType.MemeCoin ? usdtShouldPay : tokenWillReceive,
          tradeSettings?.slippage
        )
      : 0;

    const gasLimit = Number(tradeSettings?.priorityFee)
      ? BigNumber(tradeSettings?.priorityFee).multipliedBy(1e10).toString()
      : 0;

    try {
      console.log(
        "buyAndCreateToken",
        tokenDetail?.symbol,
        tokenDetail?.name,
        BigNumber(usdtAmount).multipliedBy(USDT_DECIMAL).toFixed(),
        BigNumber(minTokenOut).multipliedBy(TOKEN_DECIMAL).toFixed(0),
        address,
        tokenDetail.idx,
        tokenDetail?.userWalletAddress
      );
      const tx = await contract?.buyAndCreateToken(
        tokenDetail?.symbol,
        tokenDetail?.name,
        BigNumber(usdtAmount).multipliedBy(USDT_DECIMAL).toFixed(),
        0,
        address,
        tokenDetail.idx,
        tokenDetail?.userWalletAddress,
        {
          gasLimit: gasLimit || undefined,
        }
      );
      await tx.wait();
      handleTransactionSuccess();
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    } catch (e: any) {
      console.log({ e });
      handleError(e);

      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    }
  };

  const handleBuyTokenExactIn = async () => {
    const contract = await tokenFactoryContract;
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const minTokenOut = Number(tradeSettings?.slippage)
      ? decreaseByPercent(tokenWillReceive, tradeSettings?.slippage)
      : 0;
    const gasLimit = Number(tradeSettings?.priorityFee)
      ? BigNumber(tradeSettings?.priorityFee).multipliedBy(1e10).toString()
      : 0;
    try {
      console.log(
        "buyExactInParam",
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(USDT_DECIMAL).toFixed(),
        BigNumber(minTokenOut).multipliedBy(TOKEN_DECIMAL).toFixed(0),
        address
      );

      const tx = await contract?.buyExactIn(
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(USDT_DECIMAL).toFixed(),
        BigNumber(minTokenOut).multipliedBy(TOKEN_DECIMAL).toFixed(0),
        address,
        {
          gasLimit: gasLimit || undefined,
        }
      );
      await tx.wait();
      handleTransactionSuccess();
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    } catch (e: any) {
      console.log({ e });
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
      handleError(e);
    }
  };

  const handleBuyTokenExactOut = async () => {
    const contract = await tokenFactoryContract;
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const maxUSDTOut = Number(tradeSettings?.slippage)
      ? increaseByPercent(usdtShouldPay, tradeSettings?.slippage)
      : usdtShouldPay;
    const gasLimit = Number(tradeSettings?.priorityFee)
      ? BigNumber(tradeSettings?.priorityFee).multipliedBy(1e10).toString()
      : 0;

    let tx;
    try {
      if (!isExceedAvailableToken) {
        console.log(
          "buyExactOutParam",
          tokenDetail?.contractAddress,
          BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
          BigNumber(maxUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
          address
        );
        tx = await contract?.buyExactOut(
          tokenDetail?.contractAddress,
          BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
          BigNumber(maxUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
          address,
          {
            gasLimit: gasLimit || undefined,
          }
        );
      } else {
        console.log(
          "buyExactInParam",
          tokenDetail?.contractAddress,
          BigNumber(USDT_THRESHOLD).multipliedBy(USDT_DECIMAL).toFixed(),
          0,
          address
        );

        tx = await contract?.buyExactIn(
          tokenDetail?.contractAddress,
          BigNumber(USDT_THRESHOLD).multipliedBy(USDT_DECIMAL).toFixed(),
          0,
          address,
          {
            gasLimit: gasLimit || undefined,
          }
        );
      }
      await tx.wait();
      handleTransactionSuccess();
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    } catch (e: any) {
      console.log({ e });
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
      handleError(e);
    }
  };

  const handleSellToken = async () => {
    if (BigNumber(balance).lt(amountValue)) {
      error({
        message:
          "The current token balance is lower than the input sell amount",
      });
      return;
    }

    setLoadingStatus((prev) => ({ ...prev, sellToken: true }));
    const contract = await tokenFactoryContract;
    const sellAmountOutDiscount = BigNumber(sellAmountOut)
      .multipliedBy(DISCOUNT_FACTOR)
      .toString();

    const minUSDTOut = Number(tradeSettings?.slippage)
      ? decreaseByPercent(sellAmountOutDiscount, tradeSettings?.slippage)
      : 0;

    const gasLimit = Number(tradeSettings?.priorityFee)
      ? BigNumber(tradeSettings?.priorityFee).multipliedBy(1e10).toString()
      : 0;
    try {
      console.log(
        "sellTokenParam",
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
        BigNumber(minUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
        address
      );
      const tx = await contract?.sellExactIn(
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
        BigNumber(minUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
        address,
        {
          gasLimit: gasLimit || undefined,
        }
      );
      await tx.wait();
      handleTransactionSuccess();
      refetchUserBalance();
      setLoadingStatus((prev) => ({ ...prev, sellToken: false }));
    } catch (e: any) {
      console.log({ e });
      setLoadingStatus((prev) => ({ ...prev, sellToken: false }));
      handleError(e);
    }
  };

  const handleApprove = async () => {
    const contract = await USDTContract;
    setLoadingStatus((prev) => ({ ...prev, approve: true }));
    try {
      console.log(
        "Approve params",
        envs.TOKEN_FACTORY_ADDRESS,
        BigNumber(usdtAmount)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_HALF_UP)
          .toString()
      );
      const txn = await contract?.approve(
        envs.TOKEN_FACTORY_ADDRESS,
        BigNumber(usdtAmount)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_HALF_UP)
          .toString()
      );

      await txn?.wait();
      if (isTokenMint) {
        if (coinType === ECoinType.MemeCoin) {
          await handleBuyTokenExactOut();
        } else {
          await handleBuyTokenExactIn();
        }
      } else {
        await handleCreateAndBuyToken();
      }

      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    } catch (e: any) {
      console.log({ e });
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

  const handleBuyToken = async () => {
    const isApproved = BigNumber(usdtAmount).gt(allowance ?? "0");

    if (isApproved) {
      setIsOpenApproveModal(true);
      return;
    }

    if (isTokenMint) {
      if (coinType === ECoinType.MemeCoin) {
        await handleBuyTokenExactOut();
      } else {
        await handleBuyTokenExactIn();
      }
    } else {
      await handleCreateAndBuyToken();
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
            {coinType === ECoinType.MemeCoin ? (
              <>
                <AppNumberToolTip
                  decimal={6}
                  isFormatterK={false}
                  value={BigNumber(usdtShouldPay).toString()}
                />{" "}
                USDT
              </>
            ) : (
              <>
                <AppNumberToolTip
                  decimal={6}
                  isFormatterK={false}
                  value={BigNumber(tokenWillReceive).toString()}
                />{" "}
                {tokenDetail?.symbol}
              </>
            )}
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-16px-normal text-neutral-7">
          You will receive
          <span className="text-white-neutral text-16px-medium">
            {" "}
            <AppNumberToolTip
              decimal={6}
              isFormatterK={false}
              value={BigNumber(sellAmountOut)
                .multipliedBy(DISCOUNT_FACTOR)
                .toString()}
            />{" "}
            USDT
          </span>
        </div>
      );
    }
  };

  const handleError = (e: any) => {
    if (tabKey === TabKey.SELL) {
      if (BigNumber(balance).lt(amountValue)) {
        error({
          message:
            "The current token balance is lower than the input sell amount",
        });
        return;
      }
    }

    if (e?.code === ErrorCode.MetamaskDeniedTx) {
      error({
        message: "Transaction denied",
      });
      return;
    }

    if (e?.reason === ErrorCode.TOKEN_ALREADY_MINTED) {
      error({
        message: "Transaction Error",
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
      return;
    }
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
              loading={
                loadingStatus.buyToken ||
                (!isTokenMint && loadingStatus.approve)
              }
              disabled={isDisableBuyButton}
            >
              Buy
            </AppButton>
          ) : (
            <AppButton
              customClass="w-full"
              onClick={handleSellToken}
              loading={loadingStatus.sellToken}
              disabled={isDisableSellButton}
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
        onOk={handleApprove}
        onCancel={() => {
          setIsOpenApproveModal(false);
          setLoadingStatus((prev) => ({ ...prev, approve: false }));
        }}
      />
    </div>
  );
};

export default TradeTab;
