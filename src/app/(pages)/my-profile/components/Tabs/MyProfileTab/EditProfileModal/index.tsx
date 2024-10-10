import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppModal from "@/components/app-modal";
import AppUpload from "@/components/app-upload";
import { Flex, Form, ModalProps } from "antd";
import "./styles.scss";
import FormItemLabel from "@/components/app-form-label";

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
      <Form className="grid grid-cols-5 gap-6 mt-3" layout="vertical">
        <div className="col-span-1">
          <Flex className="flex-col md:flex-row">
            <Form.Item
              name="avatar"
              label={
                <FormItemLabel
                  label="Avatar"
                  className="text-16px-medium w-full"
                />
              }
              className="w-full md:flex-1"
            >
              <AppUpload
                isShowSuggest={false}
                className="upload-avatar"
                accept="image/png, image/jpeg"
              />
            </Form.Item>
          </Flex>
        </div>
        <div className="col-span-4">
          <Flex className="flex-col md:flex-row">
            <Form.Item
              name="name"
              className="w-full"
              label={
                <FormItemLabel
                  label="Name"
                  className="text-16px-medium w-full"
                  isRequired
                />
              }
            >
              <AppInput />
            </Form.Item>
          </Flex>
          <Flex className="flex-col md:flex-row w-full">
            <Form.Item
              className="w-full"
              name="bio"
              label={
                <FormItemLabel
                  label="Bio"
                  className="text-16px-medium w-full"
                />
              }
            >
              <AppInput.TextArea rows={5} />
            </Form.Item>
          </Flex>
        </div>
      </Form>
      <div className="flex justify-center mt-1">
        <AppButton customClass="!w-1/2 !rounded-full">Save</AppButton>
      </div>
    </AppModal>
  );
};

export default EditProfileModal;
