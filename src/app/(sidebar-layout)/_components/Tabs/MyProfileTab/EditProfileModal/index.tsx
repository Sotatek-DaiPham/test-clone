import AppButton from "@/components/app-button";
import FormItemLabel from "@/components/app-form-label";
import AppInput from "@/components/app-input";
import AppModal from "@/components/app-modal";
import AppUpload from "@/components/app-upload";
import { API_PATH } from "@/constant/api-path";
import {
  TUpdateProfilePayload,
  UpdateProfilePayload,
} from "@/entities/my-profile";
import { postAPI } from "@/service";
import { useMutation } from "@tanstack/react-query";
import { Flex, Form, ModalProps } from "antd";
import { toast } from "react-toastify";
import "./styles.scss";
import { useContext } from "react";
import { NotificationContext } from "@/libs/antd/NotificationProvider";

interface IEditProfileModalProps extends ModalProps {
  data: any;
  open: boolean;
  onOk: () => void;
}
const EditProfileModal = ({ data, onOk, ...props }: IEditProfileModalProps) => {
  const { error, success } = useContext(NotificationContext);
  const { mutate: updateProfile, isPending: isLoading } = useMutation({
    mutationFn: async (payload: TUpdateProfilePayload) => {
      return await postAPI(API_PATH.USER.UPDATE_PROFILE, payload);
    },
    onSuccess() {
      onOk?.();
      success({
        message: "Update successfully",
      });
    },
    onError() {
      error({ message: "Update failed" });
    },
  });

  const handleUpdateProfile = (values: UpdateProfilePayload) => {
    updateProfile(values);
  };

  return (
    <AppModal
      width={510}
      footer={false}
      className="p-6"
      title={false}
      centered
      {...props}
    >
      <span className="text-26px-bold text-white-neutral">Edit Profile</span>
      <Form
        onFinish={handleUpdateProfile}
        initialValues={{
          username: data?.username,
          bio: data?.bio,
          avatar: data?.avatar,
        }}
        layout="vertical"
      >
        <div className="mt-6">
          <div className="bg-neutral-1 p-6 rounded-xl mb-4">
            <Flex className="flex-col md:flex-row">
              <Form.Item name="avatar" className="w-full md:flex-1">
                <AppUpload
                  isShowSuggest={false}
                  className="upload-avatar w-full"
                  accept="image/png, image/jpeg"
                />
              </Form.Item>
            </Flex>
          </div>
          <div className="bg-neutral-1 p-6 rounded-xl">
            <Flex className="flex-col md:flex-row">
              <Form.Item
                name="username"
                required={false}
                className="w-full"
                label={
                  <FormItemLabel
                    label="Name"
                    className="text-16px-medium w-full"
                    isRequired
                  />
                }
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <AppInput placeholder="Enter name" />
              </Form.Item>
            </Flex>
            <Flex className="flex-col md:flex-row w-full mt-4">
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
                <AppInput.TextArea rows={5} placeholder="Enter bio" />
              </Form.Item>
            </Flex>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <AppButton
            customClass="!rounded-full"
            htmlType="submit"
            loading={isLoading}
          >
            Save
          </AppButton>
        </div>
      </Form>
    </AppModal>
  );
};

export default EditProfileModal;
