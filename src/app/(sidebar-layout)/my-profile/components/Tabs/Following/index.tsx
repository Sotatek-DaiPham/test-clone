import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useState } from "react";
import TabTitle from "../../TabTitle";
import UserFollow from "../../UserFollow";

const data1 = [
  {
    name: "ABC",
    avatar: null,
    follower: 1,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 2,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 0,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 345,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 345,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 4575678,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
  {
    name: "ABC",
    avatar: null,
    follower: 1231,
    bio: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam modi sed harum nihil ratione quibusdam, debitis consequuntur, id eveniet, nemo saepe. Delectus eligendi consectetur quaerat pariatur corrupti voluptates perspiciatis ut?",
    isFollow: true,
  },
];

const FollowingTab = ({ walletAddress }: { walletAddress: string }) => {
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const { searchParams } = useAppSearchParams("myProfile");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.FOLLOWINGS, {
        params: {
          limit: 10,
          pageNumber: 1,
          walletAddress: walletAddress,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "following",
  });

  const followings = get(data, "data.data", []) as MyProfileResponse[];

  console.log("data", followings);
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Following" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="right"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="my-6 grid grid-cols-2 gap-6">
        {data1?.map((user: any, index: number) => (
          <UserFollow data={user} key={index} />
        ))}
      </div>
      <AppPagination />
    </div>
  );
};

export default FollowingTab;
