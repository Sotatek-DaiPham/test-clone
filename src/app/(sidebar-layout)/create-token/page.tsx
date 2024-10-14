"use client";
import { pumpContractABI } from "@/abi/pumpContractAbi";
import AppButton from "@/components/app-button";
import FormItemLabel from "@/components/app-form-label";
import AppInput from "@/components/app-input";
import AppUpload from "@/components/app-upload";
import ButtonContained from "@/components/Button/ButtonContained";
import ConnectWalletButton from "@/components/Button/ConnectWallet";
import { ErrorCode } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { envs } from "@/constant/envs";
import { ImageValidator } from "@/helpers/upload";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { useAppSelector } from "@/libs/hooks";
import { postFormDataAPI } from "@/service";
import { useContract } from "@/web3/contracts/useContract";
import { useMutation } from "@tanstack/react-query";
import { Flex, Form } from "antd";
import { useContext, useState } from "react";

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
  [FIELD_NAMES.LOGO_UPLOAD]: File;
  [FIELD_NAMES.WEBSITE]?: string;
  [FIELD_NAMES.TWITTER]?: string;
  [FIELD_NAMES.TELEGRAM]?: string;
  [FIELD_NAMES.DISCORD]?: string;
}

const CreateTokenPage = () => {
  const [form] = Form.useForm<CreateTokenFormValues>();
  const isAuthenticated = useAppSelector((state) => state.user.accessToken);
  const { error, success } = useContext(NotificationContext);
  const [isCreating, setIsCreating] = useState(false);
  const { mutateAsync: uploadImages, isPending: isUploading } = useMutation({
    mutationFn: (payload: FormData) => {
      return postFormDataAPI(API_PATH.UPLOAD_IMAGES, payload);
    },
    mutationKey: ["upload-images"],
  });

  const tokenFactoryContract = useContract(
    pumpContractABI,
    envs.TOKEN_FACTORY_ADDRESS || ""
  );

  const handleUploadFiles = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    const uploadImageRes = await uploadImages(formData);
    return uploadImageRes.data;
  };

  const handleCreateCoin = async (values: CreateTokenFormValues) => {
    const contract = await tokenFactoryContract;
    setIsCreating(true);
    try {
      const logoUrl = await handleUploadFiles(values[FIELD_NAMES.LOGO_UPLOAD]);

      const tx = await contract?.createMemeToken(
        values[FIELD_NAMES.COIN_NAME],
        values[FIELD_NAMES.COIN_TICKER],
        logoUrl,
        values[FIELD_NAMES.DESCRIPTION]
      );

      await tx.wait();
      success({
        message: "Token created successfully",
      });
      form.resetFields();
    } catch (err: any) {
      if (err.code === ErrorCode.MetamaskDeniedTx) {
        error({
          message: "Transaction denied",
        });
      } else {
        error({
          message: "Transaction error",
        });
      }
    }

    setIsCreating(false);
  };

  return (
    <div className="create-token-page w-full mr-auto">
      <Form<CreateTokenFormValues>
        form={form}
        layout="vertical"
        onFinish={handleCreateCoin}
        initialValues={{
          [FIELD_NAMES.COIN_NAME]: "",
          [FIELD_NAMES.COIN_TICKER]: "",
          [FIELD_NAMES.DESCRIPTION]: "",
        }}
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
              <AppInput placeholder="Enter token name" />
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
              <AppInput placeholder="Enter token ticker" />
            </Form.Item>
          </Flex>
          <Form.Item
            name={FIELD_NAMES.DESCRIPTION}
            required={false}
            label={<FormItemLabel label="Description" isRequired />}
            rules={[
              {
                required: true,
                message: "Description is required",
              },
            ]}
          >
            <AppInput.TextArea rows={3} placeholder="Enter description" />
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
            <AppUpload accept="image/png, image/jpeg" />
          </Form.Item>
        </div>

        <h5 className="text-white-neutral text-22px-bold mt-4 mb-4">Links</h5>
        <div className="rounded-[24px] bg-neutral-2 backdrop-blur-[75px] p-6 mb-6">
          <Flex gap={24} className="flex-col md:flex-row">
            <Form.Item
              name={FIELD_NAMES.WEBSITE}
              label={<FormItemLabel label="Website" />}
              className="w-full md:flex-1"
            >
              <AppInput placeholder="Website URL" />
            </Form.Item>
            <Form.Item
              name={FIELD_NAMES.TWITTER}
              label={<FormItemLabel label="Twitter" />}
              className="w-full md:flex-1"
            >
              <AppInput placeholder="Twitter URL" />
            </Form.Item>
          </Flex>
          <Flex gap={24} className="flex-col md:flex-row">
            <Form.Item
              name={FIELD_NAMES.TELEGRAM}
              label={<FormItemLabel label="Telegram" />}
              className="w-full md:flex-1"
            >
              <AppInput placeholder="Telegram URL" />
            </Form.Item>
            <Form.Item
              name={FIELD_NAMES.DISCORD}
              label={<FormItemLabel label="Discord" />}
              className="w-full md:flex-1"
            >
              <AppInput placeholder="Discord URL" />
            </Form.Item>
          </Flex>
        </div>
        <div className="flex justify-end mb-9">
          {isAuthenticated ? (
            <AppButton
              onClick={() => form.submit()}
              loading={isCreating || isUploading}
              customClass="!w-fit"
            >
              Create Coin
            </AppButton>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </Form>
    </div>
  );
};

export default CreateTokenPage;
