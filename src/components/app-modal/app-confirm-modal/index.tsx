import ButtonContained from "@/components/Button/ButtonContained";
import ButtonOutlined from "@/components/Button/ButtonOutlined";
import { ApproveIcon, WarningModalIcon } from "@public/assets";
import { Flex, ModalProps } from "antd";
import Image from "next/image";
import AppModal from "..";
import "./styles.scss";

interface IConfirmModal extends ModalProps {
  title: string;
  onOk: () => void;
  loading: boolean;
  icon?: string;
  onOkText?: string;
}

const ConfirmModal = ({
  title,
  icon,
  onOkText,
  onOk,
  loading,
  ...props
}: IConfirmModal) => {
  return (
    <AppModal
      className="confirm-modal"
      width={448}
      footer={false}
      centered
      {...props}
    >
      <Flex vertical align="center" justify="space-between">
        <Image src={icon || ApproveIcon} alt="approve icon" />
        <div className="text-white-neutral text-2xl font-bold leading-8 tracking-tight mt-9 text-center">
          {title}
        </div>
        <div className="flex w-full mt-9 md:gap-5 gap-[10px">
          <ButtonOutlined className="w-1/2" onClick={props.onCancel}>
            Cancel
          </ButtonOutlined>
          <ButtonContained className="w-1/2" loading={loading} onClick={onOk}>
            {onOkText || "Confirm"}
          </ButtonContained>
        </div>
      </Flex>
    </AppModal>
  );
};

export default ConfirmModal;
