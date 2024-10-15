import AppDivider from "@/components/app-divider";
import AppPagination from "@/components/app-pagination";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import TabTitle from "../../TabTitle";

const data = [
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
];
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
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.NOTIFICATION, {
        params: {
          limit: 10,
          pageNumber: 1,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "notifications",
  });

  const notification = get(data, "data.data", []) as MyProfileResponse[];

  console.log("data", notification);
  return (
    <div>
      <TabTitle title="Notifications" />
      <div className="my-6 w-[70%]">
        {notification?.map((item: any, index: number) => (
          <NotificationItem data={item} key={index} />
        ))}
      </div>
      <AppPagination />
    </div>
  );
};

export default NotificationsTab;
