"use client";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import NoData from "@/components/no-data";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { INotificationResponse } from "@/entities/notification";
import { BeSuccessResponse } from "@/entities/response";
import isAuth from "@/helpers/isAuth";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { get } from "lodash";
import { useState } from "react";
import TabTitle from "../_components/TabTitle";

const NotificationItem = ({ data }: { data: INotificationResponse }) => {
  return (
    <div>
      <div className="text-16px-medium capitalize text-neutral-9 mb-1">
        {data?.title}
        {/* <span>{data?.address}</span>
        <span
          className={
            data?.type === "Bought" ? "text-[#64e06c]" : "text-[#da302c]"
          }
        >
          {data?.type}
        </span>
        <span>{data?.balance} of</span>
        <span className="text-[#FFFF53]">{data?.coin}</span> */}
      </div>
      <div className="text-12px-medium text-neutral-7">
        {dayjs(data?.createdAt)?.format("DD/MM/YYYY HH:mm")}
      </div>
      <AppDivider />
    </div>
  );
};

const NotificationPage = () => {
  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.NOTIFICATION, {
        params: {
          limit: params?.limit,
          pageNumber: params?.page,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<INotificationResponse[]>, any>
      >;
    },
  });

  const notification = get(data, "data.data", []) as INotificationResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  console.log("data", notification);
  return (
    <div className="m-auto max-w-[var(--width-content-sidebar-layout)]">
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Notification" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={params?.search}
          onChange={(e) => setParams({ ...params, search: e.target.value })}
        />
      </div>
      {!notification?.length && !isLoading ? (
        <NoData />
      ) : (
        <div>
          <div className="my-6 w-[70%] bg-neutral-2 p-6 rounded-3xl">
            {notification?.map((item: INotificationResponse, index: number) => (
              <NotificationItem data={item} key={index} />
            ))}
          </div>
          {/* <AppDivider />
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
          /> */}
        </div>
      )}
    </div>
  );
};

export default isAuth(NotificationPage);
