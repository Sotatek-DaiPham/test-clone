"use client";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import NoData from "@/components/no-data";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { INotificationResponse } from "@/entities/notification";
import { BeSuccessResponse } from "@/entities/response";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import isAuth from "@/helpers/isAuth";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import { useState } from "react";
import TabTitle from "../_components/TabTitle";

const NotificationItem = ({ data }: { data: INotificationResponse }) => {
  return (
    <div>
      <div className="text-16px-medium capitalize text-neutral-9 mb-1">
        {data?.title}
      </div>
      <div className="text-12px-medium text-neutral-7">
        {getTimeDDMMMYYYYHHMM(data?.createdAt)}
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
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["notification", params, debounceSearch],
    queryFn: async () => {
      return getAPI(API_PATH.USER.NOTIFICATION, {
        params: {
          ...params,
          keyword: debounceSearch,
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
      <div className="w-full flex sm:flex-row flex-col sm:items-center justify-between">
        <TabTitle title="Notification" />
        <AppInput
          className="sm:!w-[400px] w-full h-[40px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isPending ? (
        <Spin />
      ) : !notification?.length && !isPending ? (
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
