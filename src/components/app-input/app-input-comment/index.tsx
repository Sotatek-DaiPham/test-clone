import React, { ChangeEvent, useState, useRef } from "react";
import { Input, message, Form } from "antd";
import { LinkHorizontalIcon, CloseIcon } from "@public/assets";
import Image from "next/image";
import AppRoundedInfo from "@/components/app-rounded-info";

const { TextArea } = Input;

interface FileItem {
  uid: string;
  name: string;
  status: string;
  url: string | ArrayBuffer | null;
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
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [canUpload, setCanUpload] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setFileList([
            {
              uid: "-1",
              name: file.name,
              status: "done",
              url: e.target.result,
            },
          ]);
          setCanUpload(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && canUpload) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setFileList([]);
    setCanUpload(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const file = fileInputRef.current?.files?.[0] || null;
        onSubmit({ ...values, image: file });
        form.resetFields();
        removeImage();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      className="app-input-comment border border-neutral-5 rounded-[8px] p-3"
    >
      <Form.Item
        name="comment"
        rules={[{ required: true, message: "Please enter your comment" }]}
      >
        <TextArea
          rows={1}
          placeholder="Mô tả ..."
          className="comment-textarea border-none focus:shadow-none !bg-transparent text-neutral-9 !resize-none placeholder-neutral-5"
          maxLength={1200}
          showCount
          autoSize={{ minRows: 1, maxRows: 6 }}
          onKeyDown={(e) => {
            const value = e.currentTarget.value;
            if (
              value.length >= 1200 &&
              e.key !== "Backspace" &&
              e.key !== "Delete"
            ) {
              e.preventDefault();
            }
          }}
        />
      </Form.Item>
      <div className="upload-section flex items-end justify-between mt-2">
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: "none" }}
            accept="image/*"
          />
          {fileList.length > 0 && fileList[0].url && (
            <div className="uploaded-image relative">
              <Image
                src={fileList[0].url.toString()}
                alt="Uploaded"
                width={80}
                height={80}
                className="max-h-[80px] object-cover"
              />
              <Image
                src={CloseIcon}
                alt="Xóa"
                onClick={removeImage}
                className="absolute top-0 right-0 cursor-pointer"
                width={20}
                height={20}
                style={{ color: "#777E90" }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <Image
            src={LinkHorizontalIcon}
            alt="image"
            onClick={triggerFileInput}
            className={`upload-icon cursor-pointer ${
              !canUpload ? "opacity-50" : ""
            }`}
          />
          {showCancelButton && (
            <AppRoundedInfo
              text="Cancel"
              onClick={onCancel}
              customClassName="w-fit cursor-pointer"
            />
          )}
          <AppRoundedInfo
            text="Post"
            onClick={handleSubmit}
            customClassName="w-fit cursor-pointer"
          />
        </div>
      </div>
    </Form>
  );
};

export default AppInputComment;
