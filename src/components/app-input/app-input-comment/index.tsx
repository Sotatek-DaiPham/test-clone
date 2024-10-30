import { Form, Input, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CustomCommentInput from "./CustomCommentInput";
import "./styles.scss";

const { TextArea } = Input;
export interface FileItem {
  uid: string;
  name: string;
  status: string;
  url: string | ArrayBuffer | null;
  file: File;
}
interface AppInputCommentProps {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  showCancelButton?: boolean;
}

const AppInputComment: React.FC<AppInputCommentProps> = ({
  onCancel,
  onSubmit,
  showCancelButton = true,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const fileTextAreaRef = useRef<HTMLAreaElement>(null);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const file = fileList[0]?.file || null;
        onSubmit({ ...values, image: file });
        form.resetFields();
        setFileList([]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    fileTextAreaRef.current?.focus();
  }, []);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="comment"
        rules={[
          {
            required: fileList.length > 0 ? false : true,
            message: "Please enter your comment",
          },
        ]}
      >
        <CustomCommentInput
          ref={fileTextAreaRef}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          showCancelButton={showCancelButton}
          fileList={fileList}
          onFileListChange={setFileList}
        />
      </Form.Item>
    </Form>
  );
};

export default AppInputComment;
