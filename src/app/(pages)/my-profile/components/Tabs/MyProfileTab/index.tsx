import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import { useState } from "react";
import TabTitle from "../../TabTitle";
import EditProfileModal from "./EditProfileModal";
import Image from "next/image";
import { ArrowExport } from "@public/assets";

const MyProfileTab = () => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  return (
    <div>
      <TabTitle title="My profile" />
      <div className="relative grid grid-cols-4 gap-4">
        <div className="col-span-3 relative text-14px-normal">
          <AppButton
            size="small"
            rootClassName="!w-fit absolute right-0 top-[-50px]"
            typeButton="secondary"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </AppButton>
          <AppDivider />
          <div className="grid grid-cols-4 my-4">
            <span className="col-span-1 text-neutral-7">Wallet address</span>
            <div className="col-span-3 flex flex-row">
              <span className="text-14px-medium text-white-neutral mr-2">
                0xbFC2a4045A2aCA8BBf5067097e47640283e0f221
              </span>
              <Image src={ArrowExport} alt="arrow-export" className="cursor-pointer" />
            </div>
          </div>
          <AppDivider />
          <div className="grid grid-cols-4 my-4">
            <span className="col-span-1 text-neutral-7">User name</span>
            <span className="col-span-3 text-14px-medium text-white-neutral">
              abcxyz
            </span>
          </div>
          <AppDivider />
          <div className="grid grid-cols-4 my-4">
            <span className="col-span-1 text-neutral-7">Bio</span>
            <span className="col-span-3 text-14px-medium text-white-neutral">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              quisquam alias, tempore magni rem odit quia asperiores fugit. Quas
              aspernatur dolores fuga ullam deserunt sequi velit delectus nisi
              id vitae!
            </span>
          </div>
        </div>
        <div className="w-full p-auto">
          <div className="bg-[#23262F] border m-auto p-6 border-[#353945] max-w-[164px] flex flex-col justify-center rounded-2xl">
            <span className="text-16px-medium text-white-neutral text-center mb-2">
              Avatar
            </span>
            <div className="w-[115px] h-[94px] bg-[#CDB4DB] rounded-2xl"></div>
          </div>
        </div>
      </div>
      <EditProfileModal
        open={showEdit}
        onOk={() => setShowEdit(false)}
        onCancel={() => setShowEdit(false)}
        destroyOnClose={true}
        // loading={isLoginLoading}
      />
    </div>
  );
};

export default MyProfileTab;
