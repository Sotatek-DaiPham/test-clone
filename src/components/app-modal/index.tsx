"use client";
import { Modal, ModalProps } from "antd";
import "./style.scss";
import CloseModal from "@/assets/icons/close-modal.svg";

interface IModalProps extends ModalProps {
  hideClose?: boolean;
  customClassName?: string;
  maskClosable?: boolean;
}

const AppModal = ({
  children,
  hideClose = false,
  customClassName,
  maskClosable = true,
  ...props
}: IModalProps) => {
  return (
    <Modal
      footer={false}
      closeIcon={hideClose ? null : <CloseModal />}
      maskClosable={maskClosable}
      className={`app-modal ${customClassName}`}
      rootClassName="app-modal"
      centered
      {...props}
    >
      {children}
    </Modal>
  );
};

export default AppModal;
