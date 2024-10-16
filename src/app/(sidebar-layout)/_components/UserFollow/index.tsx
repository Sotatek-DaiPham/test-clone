import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import { IFollowerResponse } from "@/entities/my-profile";
import { formatAmount } from "@/helpers/formatNumber";
import { EFollow } from "../Tabs/MyProfileTab";

interface IUserFollow {
  data: IFollowerResponse;
  onFollow: (data: any) => void;
}
const UserFollow = ({ data, onFollow }: IUserFollow) => {
  return (
    <div className="flex flex-row w-full bg-neutral-2 rounded-3xl p-6">
      <div className="w-[5%] mr-4">
        <AppImage
          className="border border-white-neutral w-[50px] h-[50px] rounded-xl bg-primary-7"
          src={data?.avatar}
          alt="avatar"
        />
      </div>
      <div className="w-[80%] ml-4 mr-6">
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
        <div className="truncate-2-line text-neutral-7 mt-1">
          {data?.bio || "-"}
        </div>
      </div>
      <div className="w-[15%] flex justify-center">
        <AppButton
          size="small"
          typeButton={data?.isFollowing ? "secondary" : "primary"}
          customClass="!w-[100px] !rounded-full"
          onClick={() =>
            onFollow({
              id: data?.id,
              payload: {
                isFollow: data?.isFollowing
                  ? EFollow.UN_FOLLOW
                  : EFollow.FOLLOW,
              },
            })
          }
        >
          {data?.isFollowing ? "Unfollow" : "Follow"}
        </AppButton>
      </div>
    </div>
  );
};

export default UserFollow;
