import AppButton from "@/components/app-button";

interface IUser {
  name: string;
  avatar: any;
  follower: number;
  bio: string;
  isFollow: boolean;
}

interface IUserFollow {
  data: IUser;
}
const UserFollow = ({ data }: IUserFollow) => {
  return (
    <div className="flex flex-row w-full bg-neutral-2 rounded-3xl p-6">
      <div className="w-[5%] mr-4">
        <div className="border border-white-neutral w-[50px] h-[50px] rounded-xl bg-primary-7"></div>
      </div>
      <div className="w-[80%] ml-4 mr-6">
        <span className="text-16px-medium text-white-neutral mr-3">
          {data?.name ?? "-"}
        </span>
        <div className="text-neutral-7 text-14px-normal my-1">
          Follower
          {Number(data?.follower) > 1 ? "s" : ""}
          <span className="ml-2 text-neutral-9">{data?.follower ?? "0"}</span>
        </div>
        <div className="truncate-2-line text-neutral-7 mt-1">{data?.bio}</div>
      </div>
      <div className="w-[15%] flex justify-center">
        <AppButton
          size="small"
          typeButton={data?.isFollow ? "secondary" : "primary"}
          customClass="!w-[100px] !rounded-full"
        >
          {data?.isFollow ? "Unfollow" : "Follow"}
        </AppButton>
      </div>
    </div>
  );
};

export default UserFollow;
