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
import { TOKEN_INITIAL_PRICE, CREATE_TOKEN_FEE, ErrorCode } from "@/constant";
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
import { ImageValidator } from "@/helpers/upload";
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
import { Flex, Form } from "antd";
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
  const [form] = Form.useForm<CreateTokenFormValues>();
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
  const [initialBuyAmount, setInitialBuyAmount] = useState("");
  const [tokenCreatedIdx, setTokenCreatedIdx] = useState("");
  const [tokenCreatedId, setTokenCreatedId] = useState("");
  const {
    mutateAsync: uploadImages,
    isPending: isUploading,
    data,
  } = useMutation({
    mutationFn: (payload: FormData) => {
      return postFormDataAPI(API_PATH.UPLOAD_IMAGE, payload);
    },
    mutationKey: ["upload-images"],
  });

  const { mutateAsync: createToken, isPending: isCreateTokenLoading } =
    useMutation({
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

  const usdtShouldPay =
    coinType === ECoinType.MemeCoin && initialBuyAmount
      ? BigNumber(initialBuyAmount)
          .multipliedBy(TOKEN_INITIAL_PRICE)
          .plus(
            BigNumber(initialBuyAmount)
              .multipliedBy(TOKEN_INITIAL_PRICE)
              .multipliedBy(CREATE_TOKEN_FEE)
          )
          .toString()
      : "";

  const tokenWillReceive =
    coinType === ECoinType.StableCoin && initialBuyAmount
      ? BigNumber(initialBuyAmount)
          .minus(BigNumber(initialBuyAmount).multipliedBy(CREATE_TOKEN_FEE))
          .div(TOKEN_INITIAL_PRICE)
          .toString()
      : "";

  const tokenFactoryContract = useContract(
    pumpContractABI,
    envs.TOKEN_FACTORY_ADDRESS || ""
  );

  const coinTickerValue = useWatch(FIELD_NAMES.COIN_TICKER, form);

  const USDTContract = useContract(usdtABI, envs.USDT_ADDRESS);

  const Erc20Contract = useContract(
    usdtABI,
    "0x86E88a559bAb54AC09527b7c531aAf9F5a2B7126"
  );

  const handleUploadFiles = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadImageRes = await uploadImages(formData);
    return uploadImageRes.data;
  };

  const handleCreateTokenSuccess = (tokenId?: string) => {
    form.resetFields();
    setIsOpenInitialBuyModal(false);
    router.push(PATH_ROUTER.TOKEN_DETAIL(tokenId || tokenCreatedId));
    success({
      message: "Coin created succesfully",
      key: "1",
    });
  };

  const getUSDTAllowance = async () => {
    const contract = await USDTContract;
    try {
      const res = await contract?.allowance(
        address,
        envs.TOKEN_FACTORY_ADDRESS
      );
      const allowance = BigNumber(res).div(1e6).toString();
      return allowance;
    } catch (e) {
      console.log({ e });
    } finally {
    }
  };

  const handleApprove = async () => {
    const contract = await USDTContract;
    setLoadingStatus((prev) => ({ ...prev, approve: true }));
    try {
      const txn = await contract?.approve(
        envs.TOKEN_FACTORY_ADDRESS,
        BigNumber(initialBuyAmount).multipliedBy(1e6).toFixed()
      );

      await txn?.wait();
      await handleCreateTokenSC(tokenCreatedIdx);

      handleCreateTokenSuccess();
      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    } catch (e: any) {
      console.log({ e });
      if (e?.code === ErrorCode.MetamaskDeniedTx) {
        handleCreateTokenSuccess();
      }
    } finally {
      setLoadingStatus((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleCreateTokenSC = async (idx: string) => {
    const values = form.getFieldsValue();
    try {
      const contract = await tokenFactoryContract;
      console.log(
        "create params",
        values[FIELD_NAMES.COIN_TICKER],
        values[FIELD_NAMES.COIN_NAME],
        BigNumber(initialBuyAmount).multipliedBy(1e6).toFixed(),
        0,
        address,
        idx,
        address
      );
      const tx = await contract?.buyAndCreateToken(
        values[FIELD_NAMES.COIN_TICKER],
        values[FIELD_NAMES.COIN_NAME],
        BigNumber(initialBuyAmount).multipliedBy(1e6).toFixed(),
        0,
        address,
        idx,
        address
      );

      await tx.wait();
    } catch (e: any) {
      console.log({ e });
      if (e?.info?.error?.code === ErrorCode.INSUFFICIENT_FEE) {
        error({
          message: "Insufficient fee",
        });
        return;
      }
      if (e?.code === ErrorCode.MetamaskDeniedTx) {
        handleCreateTokenSuccess();
        return;
      }

      error({
        message: "Transaction error",
      });
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
        handleCreateTokenSuccess(createTokenDetail.id.toString());
        return;
      }

      const allowance = await getUSDTAllowance();
      const buyAmount =
        coinType === ECoinType.MemeCoin ? usdtShouldPay : initialBuyAmount;

      const isApproved = BigNumber(buyAmount).gt(allowance ?? "0");

      if (isApproved) {
        setIsOpenApproveModal(true);
        return;
      }

      await handleCreateTokenSC(createTokenDetail.idx);
      handleCreateTokenSuccess(createTokenDetail.id.toString());
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

  useEffect(() => {
    const getUSDTAllowance = async () => {
      const contract = await Erc20Contract;
      try {
        const res = await contract?.balanceOf(address);
        const allowance = BigNumber(res).div(1e18).toString();
        return allowance;
      } catch (e) {
        console.log({ e });
      } finally {
      }
    };

    (async () => {
      await getUSDTAllowance();
    })();
  }, []);

  return (
    <div className="create-token-page w-full mr-auto ml-auto">
      <Form<CreateTokenFormValues>
        form={form}
        layout="vertical"
        // initialValues={{
        //   [FIELD_NAMES.COIN_NAME]: "Token",
        //   [FIELD_NAMES.COIN_TICKER]: "tk",
        //   [FIELD_NAMES.DESCRIPTION]: "description",
        // }}
      >
        <h5 className="text-white-neutral text-22px-bold mb-4">
          Coin Information
        </h5>
        <div className="rounded-[24px] bg-neutral-2 backdrop-blur-[75px] p-6 mb-8">
          <Flex gap={24} className="flex-col md:flex-row  ">
            <Form.Item
              name={FIELD_NAMES.COIN_NAME}
              required={false}
              label={<FormItemLabel label="Coin name" isRequired />}
              className="w-full md:flex-1"
              rules={[
                {
                  required: true,
                  message: "Coin name is required",
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
                  message: "Coin ticker is required",
                },
              ]}
            >
              <AppInput placeholder="Enter token ticker" maxLength={10} />
            </Form.Item>
          </Flex>
          <Form.Item
            name={FIELD_NAMES.DESCRIPTION}
            required={false}
            label={<FormItemLabel label="Description" isRequired />}
            rules={[
              {
                required: true,
                message: "Enter token description",
              },
            ]}
          >
            <AppInput.TextArea
              rows={3}
              placeholder="Enter description"
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
            <AppUpload
              accept="image/png, image/jpeg, image/gif"
              variant="secondary"
            />
          </Form.Item>
        </div>

        <h5 className="text-white-neutral text-22px-bold mt-4 mb-4">Links</h5>
        <div className="rounded-[24px] bg-neutral-2 backdrop-blur-[75px] p-6 mb-6">
          <Flex gap={24} className="flex-col md:flex-row">
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
          </Flex>
          <Flex gap={24} className="flex-col md:flex-row">
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
              className="w-full md:flex-1"
              rules={[
                {
                  validator: urlValidator,
                },
              ]}
            >
              <AppInput placeholder="Discord URL" />
            </Form.Item>
          </Flex>
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
              customClass="!w-fit"
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
        onOk={() => handleCreateToken(false)}
        open={isOpenInitialBuyModal}
        createLoading={loadingStatus.createToken || loadingStatus.approve}
        skipLoading={loadingStatus.createTokenWithoutBuy}
        initialBuyAmount={initialBuyAmount}
        setInitalBuyAmount={setInitialBuyAmount}
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
          handleCreateTokenSuccess();
        }}
      />
    </div>
  );
};

export default CreateTokenPage;
