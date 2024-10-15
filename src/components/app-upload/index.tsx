import { CloseCircleOutlined } from "@ant-design/icons";
import { UploadIcon } from "@public/assets";
import { Image as AntdImage } from "antd";
import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";
import Image from "next/image";
import ButtonOutlined from "../Button/ButtonOutlined";
import "./styles.scss";

export interface AppUploadProps {
  onChange?: (values: { src?: string; file?: File }) => void;
  value?: { src?: string; file?: File };
  accept?: string;
  disabled?: boolean;
  isShowSuggest?: boolean;
  className?: string;
}

const AppUpload = (props: AppUploadProps) => {
  const { isShowSuggest = true, className } = props;
  const handleChange = (value: UploadChangeParam<UploadFile<any>>) => {
    const file = value.file;
    const fileUrl = URL.createObjectURL(file.originFileObj as File);

    props?.onChange?.({
      file: file.originFileObj as File,
      src: fileUrl,
    });
  };

  const handleRemoveImage = (e: any) => {
    e.stopPropagation();
    props?.onChange?.({
      file: undefined,
      src: undefined,
    });
  };

  return (
    <Upload
      className={`basic-upload ${className ?? ""}`}
      multiple={false}
      showUploadList={false}
      onChange={handleChange}
      accept={props.accept}
      disabled={props?.disabled}
    >
      {props.value?.src ? (
        <div
          className="basic-upload__image-box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <AntdImage src={props?.value?.src} preview={false} />
          {!props?.disabled ? (
            <div onClick={handleRemoveImage} className="basic-upload__remove">
              <CloseCircleOutlined className="text-white-neutral" />
            </div>
          ) : null}
        </div>
      ) : (
        isShowSuggest && (
          <div className="flex items-center gap-8">
            <Image src={UploadIcon} alt="upload icon" />
            <div className="flex items-center justify-between  flex-col">
              <div className="text-white-neutral text-[14px]">
                Drag and drop files
              </div>
              <div className="text-[#7A7F86] text-12px-medium">
                Max size - 5Mb. Jpg, Png, Gif
              </div>
            </div>
          </div>
        )
      )}
      <ButtonOutlined buttonType="secondary">Upload File</ButtonOutlined>
    </Upload>
  );
};

export default AppUpload;
