import { pumpContractABI } from "@/abi/pumpContractAbi";
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
import { envs } from "@/constant/envs";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { useTokenDetail } from "@/context/TokenDetailContext";
import {
  calculateTokenReceive,
  calculateUsdtShouldPay,
  decreaseByPercent,
  increaseByPercent,
} from "@/helpers/calculate";
import { formatRoundFloorDisplayWithCompare } from "@/helpers/formatNumber";
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
import { TabKey } from "..";

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
  const { allowance } = useUsdtAllowance(address);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [formSetting] = Form.useForm<FormSetting>();
  const [form] = Form.useForm<{ amount: string }>();
  const { tokenDetail, isTokenDetailLoading, tokenDetailSC, refetch } =
    useTokenDetail();
  const [loadingStatus, setLoadingStatus] = useState({
    buyToken: false,
    sellToken: false,
    approve: false,
  });

  const [coinType, setCoinType] = useState(ECoinType.StableCoin);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const USDTContract = useContract(usdtABI, envs.USDT_ADDRESS);
  const tokenFactoryContract = useContract(
    pumpContractABI,
    envs.TOKEN_FACTORY_ADDRESS || ""
  );
  const formSettingValues = useWatch([], formSetting);

  console.log("formSettingValues", formSettingValues);

  const isTokenListed = tokenDetailSC?.isListed;
  const isTokenMint = !!tokenDetail?.contractAddress;

  const amountValue = useWatch(AMOUNT_FIELD_NAME, form);
  const { amount: buyAmountOut } = useCalculateAmount({
    contractAddress: tokenDetail?.contractAddress,
    value: amountValue,
    decimalIn: USDT_DECIMAL,
    decimalOut: TOKEN_DECIMAL,
    functionName: "calculateBuyAmountOut",
    coinType: coinType,
  });

  const { amount: buyAmountIn } = useCalculateAmount({
    contractAddress: tokenDetail?.contractAddress,
    value: amountValue,
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

  const { balance, refetch: refetchUserBalance } = useTokenBalance(
    address,
    tokenDetail?.contractAddress
  );

  const usdtShouldPay: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.MemeCoin) {
      if (isTokenMint) {
        return buyAmountIn;
      } else {
        return calculateUsdtShouldPay(amountValue);
      }
    } else {
      return "";
    }
  }, [amountValue, buyAmountIn, isTokenMint, coinType]);

  const tokenWillReceive: any = useMemo(() => {
    if (amountValue && coinType === ECoinType.StableCoin) {
      if (isTokenMint) {
        return buyAmountOut;
      } else {
        return calculateTokenReceive(amountValue);
      }
    } else {
      return "";
    }
  }, [amountValue, buyAmountOut, isTokenMint, coinType]);

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
    refetch();
    success({
      message: "Transaction completed",
      key: "1",
    });
  };

  const handleCreateAndBuyToken = async () => {
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const contract = await tokenFactoryContract;
    const minTokenOut = formSettingValues?.slippage
      ? decreaseByPercent(tokenWillReceive, formSettingValues?.slippage)
      : 0;

    const gasLimit = formSettingValues?.priorityFee
      ? BigNumber(formSettingValues?.priorityFee).multipliedBy(1e10).toString()
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
        address
      );
      const tx = await contract?.buyAndCreateToken(
        tokenDetail?.symbol,
        tokenDetail?.name,
        BigNumber(usdtAmount).multipliedBy(USDT_DECIMAL).toFixed(),
        BigNumber(minTokenOut).multipliedBy(TOKEN_DECIMAL).toFixed(0),
        address,
        tokenDetail.idx,
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
      if (e?.info?.error?.code === ErrorCode.INSUFFICIENT_FEE) {
        error({
          message: "Insufficient fee",
        });
        return;
      }

      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    }
  };

  const handleBuyTokenExactIn = async () => {
    const contract = await tokenFactoryContract;
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const minTokenOut = formSettingValues?.slippage
      ? decreaseByPercent(tokenWillReceive, formSettingValues?.slippage)
      : 0;
    const gasLimit = formSettingValues?.priorityFee
      ? BigNumber(formSettingValues?.priorityFee).multipliedBy(1e10).toString()
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
      if (e?.info?.error?.code === ErrorCode.INSUFFICIENT_FEE) {
        error({
          message: "Insufficient fee",
        });
        return;
      }
    }
  };

  const handleBuyTokenExactOut = async () => {
    const contract = await tokenFactoryContract;
    setLoadingStatus((prev) => ({ ...prev, buyToken: true }));
    const maxUSDTOut = formSettingValues?.slippage
      ? increaseByPercent(usdtShouldPay, formSettingValues?.slippage)
      : usdtShouldPay;
    const gasLimit = formSettingValues?.priorityFee
      ? BigNumber(formSettingValues?.priorityFee).multipliedBy(1e10).toString()
      : 0;
    try {
      console.log(
        "buyExactOutParam",
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
        BigNumber(maxUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
        address
      );
      const tx = await contract?.buyExactOut(
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
        BigNumber(maxUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
        address,
        {
          gasLimit: gasLimit || undefined,
        }
      );
      await tx.wait();
      handleTransactionSuccess();
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));
    } catch (e: any) {
      setLoadingStatus((prev) => ({ ...prev, buyToken: false }));

      if (e?.info?.error?.code === ErrorCode.INSUFFICIENT_FEE) {
        error({
          message: "Insufficient fee",
        });
        return;
      }
    }
  };

  const handleSellToken = async () => {
    setLoadingStatus((prev) => ({ ...prev, sellToken: true }));
    const contract = await tokenFactoryContract;
    const minUSDTOut = formSettingValues?.slippage
      ? decreaseByPercent(sellAmountOut, formSettingValues?.slippage)
      : 0;

    const gasLimit = formSettingValues?.priorityFee
      ? BigNumber(formSettingValues?.priorityFee).multipliedBy(1e10).toString()
      : 0;
    try {
      console.log(
        "sellTokenParam",
        tokenDetail?.contractAddress,
        BigNumber(amountValue).multipliedBy(TOKEN_DECIMAL).toFixed(),
        BigNumber(minUSDTOut).multipliedBy(USDT_DECIMAL).toFixed(0),
        address
      );
      const tx = await contract?.sell(
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
      if (e?.info?.error?.code === ErrorCode.INSUFFICIENT_FEE) {
        error({
          message: "Insufficient fee",
        });
        return;
      }
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
      if (e?.code === ErrorCode.MetamaskDeniedTx) {
        error({
          message: "Transaction denied",
        });
      }
    } finally {
      setLoadingStatus((prev) => ({ ...prev, approve: false }));
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
        <div className="text-14px-normal text-neutral-7">
          {coinType === ECoinType.MemeCoin
            ? "You must pay "
            : "You will receive "}
          <span className="text-white-neutral text-14px-medium">
            {" "}
            {coinType === ECoinType.MemeCoin
              ? `${formatRoundFloorDisplayWithCompare(usdtShouldPay) || 0} USDT`
              : `${formatRoundFloorDisplayWithCompare(tokenWillReceive) || 0} ${
                  tokenDetail?.symbol
                }`}
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-14px-normal text-neutral-7">
          You will receive
          <span className="text-white-neutral text-14px-medium">
            {" "}
            {`${formatRoundFloorDisplayWithCompare(sellAmountOut) || 0} USDT`}
          </span>
        </div>
      );
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
        onValuesChange={(_, values) => console.log("formValues", values)}
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
              regex={REGEX_INPUT_DECIMAL(0, 2)}
              isSwap
            />
          ) : (
            <AppInputBalance
              tokenImageSrc={tokenDetail?.avatar}
              tokenSymbol={tokenDetail?.symbol}
              regex={REGEX_INPUT_DECIMAL(0, 2)}
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
              disabled={!isTokenMint || !amountValue}
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
