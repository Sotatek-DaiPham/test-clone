import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { getAPI } from "@/service";
import { ArrowExport, EditIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useState } from "react";
import TabTitle from "../../TabTitle";
import EditProfileModal from "./EditProfileModal";

const MyProfileTab = ({ walletAddress }: { walletAddress: string }) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { searchParams } = useAppSearchParams("myProfile");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.PROFILE(walletAddress)) as Promise<
        AxiosResponse<BeSuccessResponse<MyProfileResponse>, any>
      >;
    },
    enabled: searchParams.tab === "my-profile",
  });
  const myProfile = get(data, "data.data", {}) as MyProfileResponse;
  console.log("data", myProfile);

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="My profile" />
        <AppButton
          size="small"
          rootClassName="!w-fit"
          typeButton="secondary"
          onClick={() => setShowEdit(true)}
          classChildren="!flex !flex-row !items-center"
        >
          <Image src={EditIcon} alt="edit-profile" />
          <span className="ml-2">Edit</span>
        </AppButton>
      </div>
      <div className="flex flex-row gap-6 bg-neutral-2 rounded-3xl p-6">
        <div className="p-auto">
          <div className="w-[130px] h-[130px] bg-primary-7 rounded-full">
            {myProfile?.bio && <Image src={myProfile?.bio} alt="avatar" />}
          </div>
        </div>
        <div className="w-full text-14px-normal">
          <div className="grid grid-cols-6 mb-4">
            <span className="col-span-1 text-neutral-7">Wallet address</span>
            <div className="col-span-5 flex flex-row">
              <span className="text-14px-medium text-white-neutral mr-2">
                {myProfile?.walletAddress ?? "-"}
              </span>
              <Image
                src={ArrowExport}
                alt="arrow-export"
                className="cursor-pointer"
              />
            </div>
          </div>
          <AppDivider />
          <div className="grid grid-cols-6 my-4">
            <span className="col-span-1 text-neutral-7">User name</span>
            <span className="col-span-5 text-14px-medium text-white-neutral">
              {myProfile?.username ?? "-"}
            </span>
          </div>
          <AppDivider />
          <div className="grid grid-cols-6 my-4">
            <span className="col-span-1 text-neutral-7">Bio</span>
            <span className="col-span-5 text-14px-medium text-white-neutral">
              {myProfile?.bio ?? "-"}
            </span>
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
