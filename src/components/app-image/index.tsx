import { Image, ImageProps } from "antd";
import "./style.scss";

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

export default AppImage;
