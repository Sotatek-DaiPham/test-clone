import {
  FormSetting,
  SETTINGS_FIELD_NAMES,
} from "@/app/(non-sidebar-layout)/token-detail/_components/TradeSection/TradeTab";
import AppAmountSelect from "@/components/app-amount-select";
import AppButton from "@/components/app-button";
import AppCheckbox from "@/components/app-checkbox";
import AppInputBalance from "@/components/app-input/app-input-balance";
import { PREDEFINE_PRIORITY_FEE, PREDEFINE_SLIPPAGE } from "@/constant";
import { REGEX_INPUT_DECIMAL } from "@/constant/regex";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { EthIcon } from "@public/assets";
import { Form, FormInstance, ModalProps } from "antd";
import { useWatch } from "antd/es/form/Form";
import { Dispatch, SetStateAction, useContext } from "react";
import AppModal from "..";
import "./styles.scss";

interface ITradeSettingModal extends ModalProps {
  onOk: () => void;
  form: FormInstance<FormSetting>;
  tradeSettings: FormSetting;
  setTradeSettings: Dispatch<SetStateAction<FormSetting>>;
}

const TradeSettingModal = ({
  title,
  onOk,
  form,
  tradeSettings,
  setTradeSettings,
  ...props
}: ITradeSettingModal) => {
  const { success } = useContext(NotificationContext);
  const fontRunningValue = useWatch(SETTINGS_FIELD_NAMES.FONT_RUNNING, form);

  const handleApplyTradeSetting = (e: any) => {
    props?.onClose?.(e);
    const values = form.getFieldsValue();
    setTradeSettings({
      slippage: values[SETTINGS_FIELD_NAMES.SLIPPAGE],
      fontRunning: values[SETTINGS_FIELD_NAMES.FONT_RUNNING],
      priorityFee: values[SETTINGS_FIELD_NAMES.PRIORITY_FEE],
    });
    success({
      message: "Trade setting saved",
    });
  };
  return (
    <AppModal
      className="trade-setting-modal"
      width={500}
      footer={false}
      centered
      onCancel={(e) => {
        props.onClose?.(e);
        form.resetFields();
      }}
      {...props}
    >
      <Form form={form} initialValues={tradeSettings}>
        <div className="flex flex-col gap-4">
          <div className="text-20px-bold md:text-26px-bold text-white-neutral">
            Trade Settings
          </div>

          <div className="bg-neutral-1 p-6 rounded-[12px] flex flex-col gap-2">
            <label className="text-14px-medium text-neutral-7">
              Max Slippage
            </label>
            <Form.Item name={SETTINGS_FIELD_NAMES.SLIPPAGE}>
              <AppInputBalance
                tokenSymbol="Slippage (%)"
                regex={REGEX_INPUT_DECIMAL(0, 6)}
                maxValue={25}
              />
            </Form.Item>

            <AppAmountSelect
              numbers={PREDEFINE_SLIPPAGE}
              onSelect={(value) =>
                form.setFieldValue(
                  SETTINGS_FIELD_NAMES.SLIPPAGE,
                  value.toString()
                )
              }
            />
            <div className="text-14px-normal text-neutral-7">
              This is the maximum amount of slippage you are willing to accept
              when placing trades
            </div>
          </div>
          <div className="bg-neutral-1 p-6 rounded-[12px] flex items-start gap-2">
            <Form.Item
              name={SETTINGS_FIELD_NAMES.FONT_RUNNING}
              valuePropName="checked"
            >
              <AppCheckbox />
            </Form.Item>
            <div>
              <div className="text-16px-medium text-neutral-9">
                Front running protection
              </div>
              <div className="text-14px-normal text-neutral-7">
                Front-running protection prevents sandwich attacks on your
                swaps. With this feature enabled you can safely use high
                slippage.
              </div>
            </div>
          </div>
          {fontRunningValue ? (
            <div className="bg-neutral-1 p-6 rounded-[12px] flex flex-col gap-2">
              <label className="text-14px-medium text-neutral-7">
                Priority fee
              </label>
              <Form.Item name={SETTINGS_FIELD_NAMES.PRIORITY_FEE}>
                <AppInputBalance
                  tokenImageSrc={EthIcon}
                  tokenSymbol="ETH"
                  regex={REGEX_INPUT_DECIMAL(0, 6)}
                />
              </Form.Item>
              <AppAmountSelect
                numbers={PREDEFINE_PRIORITY_FEE}
                customClass="[&>button]:!flex-none md:[&>button]:!flex-1"
                onSelect={(value) =>
                  form.setFieldValue(
                    SETTINGS_FIELD_NAMES.PRIORITY_FEE,
                    value.toString()
                  )
                }
              />
              <div className="text-14px-normal text-neutral-7">
                A higher priority fee will speed up the confirmation of your
                transactions.
              </div>
            </div>
          ) : null}

          <AppButton onClick={handleApplyTradeSetting}>Apply</AppButton>
        </div>
      </Form>
    </AppModal>
  );
};

export default TradeSettingModal;
