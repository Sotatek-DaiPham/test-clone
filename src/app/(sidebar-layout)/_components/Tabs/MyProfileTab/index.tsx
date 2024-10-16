import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useFollowUser from "@/hooks/useFollowUser";
import { NotificationContext } from "@/libs/antd/NotificationProvider";
import { useAppSelector } from "@/libs/hooks";
import { getAPI } from "@/service";
import { ArrowExport, EditIcon } from "@public/assets";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import TabTitle from "../../TabTitle";
import EditProfileModal from "./EditProfileModal";

export enum EFollow {
  FOLLOW = "FOLLOW",
  UN_FOLLOW = "UN_FOLLOW",
}
const MyProfileTab = ({ apiPath }: { apiPath: string }) => {
  const { error, success } = useContext(NotificationContext);
  const { openConnectModal } = useConnectModal();
  const { id } = useParams();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { searchParams } = useAppSearchParams("myProfile");
  const { userId } = useAppSelector((state) => state.user);

  const { data, refetch } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      return getAPI(apiPath) as Promise<
        AxiosResponse<BeSuccessResponse<MyProfileResponse>, any>
      >;
    },
    enabled: !searchParams.tab ? true : searchParams.tab === "my-profile",
  });

  const myProfile = get(data, "data.data", {}) as MyProfileResponse;

  const { onFollow } = useFollowUser({
    onFollowSuccess: () => {
      success({ message: "Follow successfully" });
      refetch();
    },
    onFollowFailed: (message: string) => {
      console.log("message", message);
      error({ message: "Follow failed" });
    },
  });

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="My profile" />
        {id ? (
          <AppButton
            size="small"
            typeButton={myProfile?.isFollow ? "secondary" : "primary"}
            customClass="!w-[100px] !rounded-full"
            onClick={
              !!userId
                ? () =>
                    onFollow({
                      id: myProfile?.id,
                      payload: {
                        isFollow: myProfile?.isFollow
                          ? EFollow.UN_FOLLOW
                          : EFollow.FOLLOW,
                      },
                    })
                : openConnectModal
            }
          >
            {myProfile?.isFollow ? "Unfollow" : "Follow"}
          </AppButton>
        ) : (
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
        )}
      </div>
      <div className="flex flex-row gap-6 bg-neutral-2 rounded-3xl p-6">
        <div className="p-auto ">
          <AppImage
            className="!bg-neutral-4 w-[130px] h-[130px] rounded-full"
            src={myProfile?.avatar}
            alt="avatar"
          />
        </div>
        <div className="w-full text-14px-normal">
          <div className="grid grid-cols-6 mb-4">
            <span className="col-span-1 text-neutral-7">Wallet address</span>
            <div className="col-span-5 flex flex-row">
              <span className="text-14px-medium text-white-neutral mr-2">
                {myProfile?.walletAddress || "-"}
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
              {myProfile?.username || "-"}
            </span>
          </div>
          <AppDivider />
          <div className="grid grid-cols-6 my-4">
            <span className="col-span-1 text-neutral-7">Bio</span>
            <span className="col-span-5 text-14px-medium text-white-neutral">
              {myProfile?.bio || "-"}
            </span>
          </div>
        </div>
      </div>
      <EditProfileModal
        data={{
          username: myProfile?.username,
          avatar: myProfile?.avatar,
          bio: myProfile?.bio,
        }}
        open={showEdit}
        onOk={() => {
          refetch();
          setShowEdit(false);
        }}
        onCancel={() => setShowEdit(false)}
        destroyOnClose={true}
      />
    </div>
  );
};

export default MyProfileTab;
