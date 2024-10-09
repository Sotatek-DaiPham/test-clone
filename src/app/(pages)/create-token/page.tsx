"use client";
import FormItemLabel from "@/components/app-form-label";
import AppInput from "@/components/app-input";
import AppInputBalance from "@/components/app-input/app-input-balance";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { EthIcon } from "@public/assets";
import { Form } from "antd";

const CreateTokenPage = () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ normalInput: "", tokenInput: "", searchInput: "" }}
    >
      <Form.Item
        name="normalInput"
        label={<FormItemLabel label="Token Input" isRequired />}
      >
        <AppInput />
      </Form.Item>
      <Form.Item
        name="tokenInput"
        label={<FormItemLabel label="Token Balance" />}
      >
        <AppInputBalance
          tokenSymbol="ETH"
          tokenImageSrc={EthIcon}
          regex={REGEX_INPUT_DECIMAL(0, 2)}
        />
      </Form.Item>
      <Form.Item
        name="searchInput"
        label={<FormItemLabel label="Search Input" />}
      >
        <AppInput isSearch />
      </Form.Item>
    </Form>
  );
};

export default CreateTokenPage;
