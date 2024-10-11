import AppButton from "@/components/app-button";
import React from "react";

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
    <div className="flex flex-row w-full mb-6">
      <div className="w-[5%] mr-4">
        <div className="border border-white w-[50px] h-[50px] rounded-full bg-[#CDB4DB]"></div>
      </div>
      <div className="w-[80%] mr-6">
        <span className="">
          <span className="text-16px-medium text-white mr-3">
            {data?.name ?? "-"}
          </span>
          <span className="text-16px-normal text-[#8D8D8D]">
            {data?.follower ?? "0"} follower
            {Number(data?.follower) > 1 ? "s" : ""}
          </span>
        </span>
        <div className="truncate-2-line text-[#8D8D8D] mt-1">{data?.bio}</div>
      </div>
      <div className="w-[15%]">
        <AppButton
          size="small"
          customClass="!w-[100px] !rounded-full"
          classChildren="!text-black"
        >
          {data?.isFollow ? "Unfollow" : "Follow"}
        </AppButton>
      </div>
    </div>
  );
};

export default UserFollow;
