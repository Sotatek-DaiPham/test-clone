import AppButton from "@/components/app-button";
import TabTitle from "../../TabTitle";
import AppImage from "@/components/app-image";
import { Divider } from "antd";
import AppDivider from "@/components/app-divider";

const MyProfileTab = () => {
  return (
    <div>
      <TabTitle title="My profile" />
      <div className="relative grid grid-cols-4 gap-4">
        <div className="col-span-3 relative">
          <AppButton
            size="small"
            rootClassName="!w-fit absolute right-0 top-[-50px]"
            typeButton="secondary"
          >
            Edit
          </AppButton>
          <AppDivider />
        </div>
        <div className="w-full p-auto">
          <div className="bg-[#23262F] border m-auto p-6 border-[#353945] max-w-[164px] flex flex-col justify-center rounded-2xl">
            <span className="text-16px-medium text-white text-center mb-2">
              Avatar
            </span>
            <div className="w-[115px] h-[94px] bg-[#CDB4DB] rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileTab;
