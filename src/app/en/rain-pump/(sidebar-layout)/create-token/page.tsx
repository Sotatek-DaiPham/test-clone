"use client";
import { pumpContractABI } from "@/abi/pumpContractAbi";
import { usdtABI } from "@/abi/usdtAbi";
import AppButton from "@/components/app-button";
import FormItemLabel from "@/components/app-form-label";
import AppInput from "@/components/app-input";
import ConfirmModal from "@/components/app-modal/app-confirm-modal";
import InitialBuyModal from "@/components/app-modal/app-initial-buy-modal";
import AppUpload from "@/components/app-upload";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import {
  ACCEPT_IMAGE_EXTENSION,
  AMOUNT_FIELD_NAME,
  USDT_DECIMAL,
} from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { envs } from "@/constant/envs";
import {
  DiscordUrlRegex,
  TelegramUrlRegex,
  TwitterUrlRegex,
  WebsiteUrlRegex,
} from "@/constant/regex";
import { PATH_ROUTER } from "@/constant/router";
import { BeSuccessResponse } from "@/entities/response";
import {
  calculateTokenReceive,
  calculateUsdtShouldPay,
} from "@/helpers/calculate";
import { ImageValidator } from "@/helpers/upload";
import useUsdtAllowance from "@/hooks/useUsdtAllowance";
import useWindowSize from "@/hooks/useWindowSize";
import {
  ECoinType,
  ICreateTokenReq,
  ICreateTokenRes,
} from "@/interfaces/token";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { useAppSelector } from "@/libs/hooks";
import { postFormDataAPI } from "@/service";
import { useContract } from "@/web3/contracts/useContract";
import { useMutation } from "@tanstack/react-query";
import { Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import { AxiosResponse } from "axios";
import BigNumber from "bignumber.js";
import { get } from "lodash";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const FIELD_NAMES = {
  COIN_NAME: "coinName",
  COIN_TICKER: "coinTicker",
  DESCRIPTION: "description",
  LOGO_UPLOAD: "logoUpload",
  WEBSITE: "website",
  TWITTER: "twitter",
  TELEGRAM: "telegram",
  DISCORD: "discord",
} as const;

interface CreateTokenFormValues {
  [FIELD_NAMES.COIN_NAME]: string;
  [FIELD_NAMES.COIN_TICKER]: string;
  [FIELD_NAMES.DESCRIPTION]: string;
  [FIELD_NAMES.LOGO_UPLOAD]: any;
  [FIELD_NAMES.WEBSITE]?: string;
  [FIELD_NAMES.TWITTER]?: string;
  [FIELD_NAMES.TELEGRAM]?: string;
  [FIELD_NAMES.DISCORD]?: string;
}

const urlRegexMap: {
  [x: string]: RegExp;
} = {
  [FIELD_NAMES.WEBSITE]: WebsiteUrlRegex,
  [FIELD_NAMES.TWITTER]: TwitterUrlRegex,
  [FIELD_NAMES.TELEGRAM]: TelegramUrlRegex,
  [FIELD_NAMES.DISCORD]: DiscordUrlRegex,
};

const urlValidator = (props: any, value: string) => {
  if (!!value && !urlRegexMap[props.field].test(value)) {
    return Promise.reject("Invalid URL");
  }

  return Promise.resolve();
};

const CreateTokenPage = () => {
  const router = useRouter();
  const { isDesktop } = useWindowSize();
  const [form] = Form.useForm<CreateTokenFormValues>();
  const [amountForm] = Form.useForm<{ amount: string }>();
  const { accessToken: isAuthenticated, address } = useAppSelector(
    (state) => state.user
  );
  const { error, success } = useContext(NotificationContext);
  const [loadingStatus, setLoadingStatus] = useState({
    createToken: false,
    createTokenWithoutBuy: false,
    approve: false,
  });
  const [isOpenInitialBuyModal, setIsOpenInitialBuyModal] = useState(false);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const [tokenCreatedIdx, setTokenCreatedIdx] = useState("");
  const [tokenCreatedId, setTokenCreatedId] = useState("");
  const { mutateAsync: uploadImages } = useMutation({
    mutationFn: (payload: FormData) => {
      return postFormDataAPI(API_PATH.UPLOAD_IMAGE, payload);
    },
    mutationKey: ["upload-images"],
  });

  const { allowance } = useUsdtAllowance(address);

  const { mutateAsync: createToken } = useMutation({
    mutationFn: (
      payload: ICreateTokenReq
    ): Promise<AxiosResponse<BeSuccessResponse<ICreateTokenRes>>> => {
      return postFormDataAPI(API_PATH.TOKEN.CREATE_TOKEN, payload);
    },
    onError: (err) => {
      error({ message: "Create Failed" });
    },
    mutationKey: ["create-token"],
  });

  const [coinType, setCoinType] = useState(ECoinType.StableCoin);

  const uploadImage = useWatch(FIELD_NAMES.LOGO_UPLOAD, form);
  const initialBuyAmount = useWatch(AMOUNT_FIELD_NAME, amountForm);

  const usdtShouldPay =
    coinType === ECoinType.MemeCoin && initialBuyAmount
      ? calculateUsdtShouldPay(initialBuyAmount)
      : "";

  const tokenWillReceive =
    coinType === ECoinType.StableCoin && initialBuyAmount
      ? calculateTokenReceive(initialBuyAmount)
      : "";
  const buyAmount =
    coinType === ECoinType.MemeCoin
      ? BigNumber(usdtShouldPay)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_DOWN)
          .dividedBy(USDT_DECIMAL)
          .toFixed(6)
      : initialBuyAmount;

  const tokenFactoryContract = useContract(
    pumpContractABI,
    envs.TOKEN_FACTORY_ADDRESS || ""
  );

  const coinTickerValue = useWatch(FIELD_NAMES.COIN_TICKER, form);

  const USDTContract = useContract(usdtABI, envs.USDT_ADDRESS);

  const handleUploadFiles = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadImageRes = await uploadImages(formData);
    return uploadImageRes.data;
  };

  const handleCreateTokenSuccess = (
    tokenId?: string,
    isMint: boolean = true,
    isWithoutBuy: boolean = false
  ) => {
    form.resetFields();
    setIsOpenInitialBuyModal(false);
    router.push(PATH_ROUTER.TOKEN_DETAIL(tokenId || tokenCreatedId));
    if (isMint) {
      success({
        message: "Initial buy transaction completed. Coin created succesfully",
        key: "1",
      });
    } else {
      if (isWithoutBuy) {
        success({
          message: "Coin created succesfully",
          key: "2",
        });
      } else {
        success({
          message: "Initial buy transaction denied. Coin created succesfully",
          key: "3",
        });
      }
    }
  };

  const handleApprove = async () => {
    const contract = await USDTContract;
    setLoadingStatus((prev) => ({ ...prev, approve: true }));
    try {
      const txn = await contract?.approve(
        envs.TOKEN_FACTORY_ADDRESS,
        BigNumber(buyAmount).multipliedBy(USDT_DECIMAL).toFixed()
      );

      await txn?.wait();
      await handleCreateTokenSC(tokenCreatedIdx);

      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    } catch (e: any) {
      console.log({ e });
      handleCreateTokenSuccess(undefined, false);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleCreateTokenSC = async (idx: string, tokenId?: string) => {
    const values = form.getFieldsValue();
    try {
      const contract = await tokenFactoryContract;

      console.log(
        "create params",
        values[FIELD_NAMES.COIN_TICKER],
        values[FIELD_NAMES.COIN_NAME],
        BigNumber(buyAmount)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString(),
        0,
        address,
        idx,
        address
      );

      const tx = await contract?.buyAndCreateToken(
        values[FIELD_NAMES.COIN_TICKER],
        values[FIELD_NAMES.COIN_NAME],
        BigNumber(buyAmount)
          .multipliedBy(USDT_DECIMAL)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString(),
        0,
        address,
        idx,
        address
      );

      await tx.wait();
      handleCreateTokenSuccess(tokenId);
    } catch (e: any) {
      console.log({ e });
      handleCreateTokenSuccess(tokenId, false);
    }
  };

  const handleCreateToken = async (withoutBuy: boolean = false) => {
    if (withoutBuy) {
      setLoadingStatus((prev) => ({ ...prev, createTokenWithoutBuy: true }));
    } else {
      setLoadingStatus((prev) => ({ ...prev, createToken: true }));
    }
    try {
      const values = form.getFieldsValue();
      const uploadedFile = await handleUploadFiles(
        values[FIELD_NAMES.LOGO_UPLOAD]?.file
      );
      const res = await createToken({
        name: values[FIELD_NAMES.COIN_NAME],
        symbol: values[FIELD_NAMES.COIN_TICKER],
        description: values[FIELD_NAMES.DESCRIPTION],
        avatar: uploadedFile.data,
        website: values[FIELD_NAMES.WEBSITE],
        twitter: values[FIELD_NAMES.TWITTER],
        telegram: values[FIELD_NAMES.TELEGRAM],
        discord: values[FIELD_NAMES.DISCORD],
      });

      const createTokenDetail = get(res, "data.data");

      setTokenCreatedIdx(createTokenDetail.idx);
      setTokenCreatedId(createTokenDetail.id.toString());

      if (!initialBuyAmount || withoutBuy) {
        setIsOpenInitialBuyModal(false);
        handleCreateTokenSuccess(createTokenDetail.id.toString(), false, true);
        return;
      }

      const isApproved = BigNumber(buyAmount).gt(allowance ?? "0");

      if (isApproved) {
        setIsOpenApproveModal(true);
        return;
      }

      await handleCreateTokenSC(
        createTokenDetail.idx,
        createTokenDetail?.id.toString()
      );
    } catch (e) {
      console.log({ e });
    } finally {
      if (withoutBuy) {
        setLoadingStatus((prev) => ({ ...prev, createTokenWithoutBuy: false }));
      } else {
        setLoadingStatus((prev) => ({ ...prev, createToken: false }));
      }
    }
  };

  return (
    <div className="create-token-page w-full mr-auto ml-auto">
      {!isDesktop ? (
        <div className="text-20px-bold mb-4 text-white-neutral">
          Create A New Token
        </div>
      ) : null}

      <Form<CreateTokenFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          [FIELD_NAMES.COIN_NAME]: "",
          [FIELD_NAMES.COIN_TICKER]: "",
          [FIELD_NAMES.DESCRIPTION]: "",
        }}
      >
        <h5 className="text-16px-bold md:text-22px-bold mb-4 text-primary-main">
          Coin Information
        </h5>
        <div className="rounded-[24px] bg-neutral-2 backdrop-blur-[75px] md:p-6 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:gap-6 gap-0">
            <Form.Item
              name={FIELD_NAMES.COIN_NAME}
              required={false}
              label={<FormItemLabel label="Coin name" isRequired />}
              className="w-full md:flex-1"
              rules={[
                {
                  required: true,
                  message: "Token name is required",
                },
              ]}
            >
              <AppInput placeholder="Enter token name" maxLength={30} />
            </Form.Item>
            <Form.Item
              name={FIELD_NAMES.COIN_TICKER}
              required={false}
              label={<FormItemLabel label="Coint ticker" isRequired />}
              className="w-full md:flex-1"
              rules={[
                {
                  required: true,
                  message: "Token ticker is required",
                },
              ]}
            >
              <AppInput placeholder="Enter token ticker" maxLength={10} />
            </Form.Item>
          </div>
          <Form.Item
            name={FIELD_NAMES.DESCRIPTION}
            required={false}
            label={<FormItemLabel label="Description" />}
          >
            <AppInput.TextArea
              rows={3}
              placeholder="Enter token description"
              maxLength={1200}
            />
          </Form.Item>
          <Form.Item
            name={FIELD_NAMES.LOGO_UPLOAD}
            label={<FormItemLabel label="Logo Upload" isRequired />}
            className="mb-0"
            rules={[
              {
                validator: ImageValidator,
              },
            ]}
          >
            <AppUpload accept={ACCEPT_IMAGE_EXTENSION} variant="secondary" />
          </Form.Item>
        </div>

        <h5 className="text-primary-main text-16px-bold md:text-22px-bold mt-4 mb-4">
          Links
        </h5>
        <div className="rounded-[24px] bg-neutral-2 backdrop-blur-[75px] md:p-6 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:gap-6 gap-0">
            <Form.Item
              name={FIELD_NAMES.WEBSITE}
              label={<FormItemLabel label="Website" />}
              className="w-full md:flex-1"
              rules={[
                {
                  validator: urlValidator,
                },
              ]}
            >
              <AppInput placeholder="Website URL" />
            </Form.Item>
            <Form.Item
              name={FIELD_NAMES.TWITTER}
              label={<FormItemLabel label="Twitter" />}
              className="w-full md:flex-1"
              rules={[
                {
                  validator: urlValidator,
                },
              ]}
            >
              <AppInput placeholder="Twitter URL" />
            </Form.Item>
          </div>
          <div className="flex flex-col md:flex-row md:gap-6 gap-0">
            <Form.Item
              name={FIELD_NAMES.TELEGRAM}
              label={<FormItemLabel label="Telegram" />}
              className="w-full md:flex-1"
              rules={[
                {
                  validator: urlValidator,
                },
              ]}
            >
              <AppInput placeholder="Telegram URL" />
            </Form.Item>
            <Form.Item
              name={FIELD_NAMES.DISCORD}
              label={<FormItemLabel label="Discord" />}
              className="w-full md:flex-1 md:mb-6 !mb-0"
              rules={[
                {
                  validator: urlValidator,
                },
              ]}
            >
              <AppInput placeholder="Discord URL" />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-end mb-9">
          {isAuthenticated ? (
            <AppButton
              onClick={async () => {
                await form.validateFields();
                const errors = form.getFieldsError();
                const hasErrors = errors.some(
                  (error) => error.errors.length > 0
                );

                if (!hasErrors) {
                  setIsOpenInitialBuyModal(true);
                }
              }}
              customClass="md:!w-fit !w-full"
            >
              Create Coin
            </AppButton>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </Form>
      <InitialBuyModal
        onCancel={() => {
          setIsOpenInitialBuyModal(false);
        }}
        onSkip={() => {
          handleCreateToken(true);
        }}
        form={amountForm}
        onOk={() => handleCreateToken(false)}
        open={isOpenInitialBuyModal}
        createLoading={loadingStatus.createToken || loadingStatus.approve}
        skipLoading={loadingStatus.createTokenWithoutBuy}
        initialBuyAmount={initialBuyAmount}
        tokenSymbol={coinTickerValue}
        usdtShouldPay={usdtShouldPay}
        tokenWillReceive={tokenWillReceive}
        coinType={coinType}
        setCoinType={setCoinType}
        tokenImage={uploadImage?.src}
      />
      <ConfirmModal
        title="You need to approve your tokens in order to make transaction"
        onOkText="Approve"
        open={isOpenApproveModal}
        loading={loadingStatus.approve || loadingStatus.createToken}
        onOk={handleApprove}
        onCancel={() => {
          setIsOpenApproveModal(false);
          handleCreateTokenSuccess(undefined, false);
        }}
      />
    </div>
  );
};

export default CreateTokenPage;
