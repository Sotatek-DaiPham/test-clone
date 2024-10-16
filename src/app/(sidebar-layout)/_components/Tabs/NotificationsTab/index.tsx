import AppDivider from "@/components/app-divider";
import AppPagination from "@/components/app-pagination";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import { useState } from "react";
import TabTitle from "../../TabTitle";

const NotificationItem = ({ data }: { data: any }) => {
  return (
    <div>
      <div className="text-18px-medium text-white-neutral">{data?.time}</div>
      <div className="text-18px-medium text-white-neutral flex flex-row gap-2 my-6">
        <span>{data?.address}</span>
        <span
          className={
            data?.type === "Bought" ? "text-[#64e06c]" : "text-[#da302c]"
          }
        >
          {data?.type}
        </span>
        <span>{data?.balance} of</span>
        <span className="text-[#FFFF53]">{data?.coin}</span>
      </div>
      <AppDivider />
    </div>
  );
};
const NotificationsTab = () => {
  const { searchParams } = useAppSearchParams("myProfile");
  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.NOTIFICATION, {
        params: {
          limit: params?.limit,
          pageNumber: params?.page,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "notifications",
  });

  const notification = get(data, "data.data", []) as MyProfileResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  console.log("data", notification);
  return (
    <div>
      <TabTitle title="Notifications" />
      <div className="my-6 w-[70%]">
        {/* {notification?.map((item: any, index: number) => (
          <NotificationItem data={item} key={index} />
        ))} */}
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

export default NotificationsTab;
