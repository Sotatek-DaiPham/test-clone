import { Image, ImageProps } from "antd";
import "./style.scss";
import withClient from "@/helpers/with-client";

interface AppImageProps extends ImageProps {
  className?: string;
  alt?: string;
}

const AppImage = ({ className, alt, ...props }: AppImageProps) => {
  return (
    <Image
      rootClassName={`app-image ${className}`}
      alt={alt}
      {...props}
      preview={false}
    />
  );
};

export default withClient(AppImage);
