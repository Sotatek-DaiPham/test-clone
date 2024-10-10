import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppModal from "@/components/app-modal";
import AppUpload from "@/components/app-upload";
import { Form, ModalProps } from "antd";
import "./styles.scss";

interface IEditProfileModalProps extends ModalProps {
  open: boolean;
  onOk: () => void;
}
const EditProfileModal = ({ onOk, ...props }: IEditProfileModalProps) => {
  return (
    <AppModal
      width={850}
      footer={false}
      className="p-6"
      title={false}
      centered
      {...props}
    >
      <Form className="grid grid-cols-5 gap-6 mt-3">
        <div className="col-span-1 overflow-hidden">
          <span className="text-16px-medium text-white">Avatar</span>
          <Form.Item name="avatar">
            <AppUpload
              isShowSuggest={false}
              className="upload-avatar"
              accept="image/png, image/jpeg"
            />
          </Form.Item>
        </div>
        <div className="col-span-4">
          <span className="text-16px-medium text-white">Name *</span>
          <Form.Item name="Name">
            <AppInput />
          </Form.Item>

          <span className="text-16px-medium text-white">Bio</span>
          <Form.Item name="Bio">
            <AppInput.TextArea rows={5} />
          </Form.Item>
        </div>
      </Form>
      <div className="flex justify-center mt-1">
        <AppButton customClass="!w-1/2 !rounded-full">Save</AppButton>
      </div>
    </AppModal>
  );
};

export default EditProfileModal;
