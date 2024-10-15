import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import useFollowUser from "@/hooks/useFollowUser";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useState } from "react";
import { toast } from "react-toastify";
import TabTitle from "../../TabTitle";
import UserFollow from "../../UserFollow";

const FollowingTab = ({ walletAddress }: { walletAddress: string }) => {
  const [params, setParams] = useState<any>({
    search: "",
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const debounceSearch = useDebounce(params?.search);
  const { searchParams } = useAppSearchParams("myProfile");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.FOLLOWINGS, {
        params: {
          limit: params?.limit,
          pageNumber: params?.page,
          walletAddress: walletAddress,
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "following",
  });

  const followings = get(data, "data.data", []) as MyProfileResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  const { onFollow } = useFollowUser({
    onFollowSuccess: () => {
      toast.success("Risk Management edited successfully");
      refetch();
    },
    onFollowFailed: (message: string) => {
      console.log("message", message);
      toast.error("Risk Management edited failed");
    },
  });

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Following" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="right"
          placeholder="Search"
          value={params?.search}
          onChange={(e) => setParams({ ...params, search: e.target.value })}
        />
      </div>
      <div className="my-6 grid grid-cols-2 gap-6">
        {followings?.map((user: any, index: number) => (
          <UserFollow
            data={{
              id: user.id,
              username: user?.username,
              bio: user?.bio,
              avatar: user?.avatar,
              isFollowing: user?.isFollowing,
              follower: user?.follower,
            }}
            key={index}
            onFollow={(payload: any) => onFollow(payload)}
          />
        ))}
      </div>
      <AppDivider />
      <AppPagination
        className="w-full !justify-end !mr-6"
        hideOnSinglePage={true}
        showTotal={(total, range) => (
          <ShowingPage total={total} range={range} />
        )}
        current={params?.page}
        pageSize={params?.limit}
        total={total}
        onChange={(page, size) =>
          setParams((prev: any) => ({ ...prev, page, limit: size }))
        }
      />
    </div>
  );
};

export default FollowingTab;
