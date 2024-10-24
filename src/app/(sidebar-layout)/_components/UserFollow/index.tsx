import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import { PATH_ROUTER } from "@/constant/router";
import { IFollowerResponse } from "@/entities/my-profile";
import { formatAmount } from "@/helpers/formatNumber";
import { useAppSelector } from "@/libs/hooks";
import { ImageDefaultIcon } from "@public/assets";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { EFollow } from "../Tabs/MyProfileTab";
import useWindowSize from "@/hooks/useWindowSize";

interface IUserFollow {
  data: IFollowerResponse;
  onFollow: (data: any) => void;
}
const UserFollow = ({ data, onFollow }: IUserFollow) => {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { userId } = useAppSelector((state) => state.user);
  const { address: userAddress } = useAccount();
  const { isMobile } = useWindowSize();
  return (
    <div
      className="flex flex-col w-full bg-neutral-2 rounded-3xl p-6 cursor-pointer"
      onClick={() =>
        router.push(PATH_ROUTER.USER_PROFILE(data?.wallet_address))
      }
    >
      <div className="w-full flex flex-row">
        <div className="sm:w-[5%] w-[10%] mr-4">
          {data?.avatar ? (
            <AppImage
              className="!bg-neutral-4 !w-[50px] !h-[50px] rounded-xl overflow-hidden flex [&>img]:!object-contain"
              alt="logo"
              src={data?.avatar}
            />
          ) : (
            <div className="border border-white-neutral !w-[50px] !h-[50px] rounded-xl overflow-hidden">
              <Image
                className="flex bg-primary-7 [&>img]:!object-contain"
                alt="logo"
                src={ImageDefaultIcon}
              />
            </div>
          )}
        </div>
        <div className="sm:w-[80%] w-[40%] ml-4 mr-6">
          <span className="text-16px-medium text-white-neutral mr-3">
            {data?.username || "-"}
          </span>
          <div className="text-neutral-7 text-14px-normal my-1">
            Follower
            {Number(data?.numberFollower) > 1 ? "s" : ""}
            <span className="ml-2 text-neutral-9">
              {formatAmount(data?.numberFollower || "0")}
            </span>
          </div>
          {!isMobile && (
            <div className="truncate-2-line text-neutral-7 mt-1">
              {data?.bio || "-"}
            </div>
          )}
        </div>
        <div className="sm:w-[15%] w-[30%] flex justify-center">
          {userAddress !== data?.wallet_address && (
            <AppButton
              size="small"
              typeButton={data?.isFollowing ? "secondary" : "primary"}
              customClass="!w-[100px] !rounded-full"
              onClick={
                !!userId
                  ? (e) => {
                      e.stopPropagation();
                      onFollow({
                        id: data?.id,
                        payload: {
                          isFollow: data?.isFollowing
                            ? EFollow.UN_FOLLOW
                            : EFollow.FOLLOW,
                        },
                      });
                    }
                  : openConnectModal
              }
            >
              {data?.isFollowing ? "Unfollow" : "Follow"}
            </AppButton>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="truncate-2-line text-neutral-7 mt-1">
          {data?.bio || "-"}
        </div>
      )}
    </div>
  );
};

export default UserFollow;
