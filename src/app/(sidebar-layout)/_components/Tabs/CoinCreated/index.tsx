import ProjectCard from "@/app/(sidebar-layout)/_components/ProjectCard";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import NoData from "@/components/no-data";
import ShowingPage from "@/components/showing-page";
import { EDirection, LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { IProjectCardResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useEffect, useState } from "react";
import TabTitle from "../../TabTitle";
import AppPaginationCustom from "@/components/app-pagination/app-pagination-custom";
import useSocket from "@/hooks/useSocket";
import { ESocketEvent } from "@/libs/socket/constants";

const CoinCreatedTab = ({ walletAddress }: { walletAddress: string }) => {
  const { addEvent, isConnected, removeEvent } = useSocket();
  const { searchParams } = useAppSearchParams("myProfile");
  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const [search, setSearch] = useState<string>("");

  const debounceSearch = useDebounce(search, () =>
    setParams({ ...params, page: 1 })
  );

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["coin-created", params, debounceSearch, searchParams],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.COINS_CREATED, {
        params: {
          ...params,
          orderBy: "createdAt",
          direction: EDirection.DESC,
          walletAddress: walletAddress,
          keyword: debounceSearch,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<IProjectCardResponse[]>, any>
      >;
    },
    enabled: searchParams.tab === "coin-created",
  });

  const coinCreated = get(data, "data.data", []) as IProjectCardResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  useEffect(() => {
    if (isConnected) {
      addEvent(ESocketEvent.BUY, (data) => {
        if (data) {
        }
      });
      addEvent(ESocketEvent.SELL, (data) => {
        if (data) {
        }
      });
    }
    return () => {
      removeEvent(ESocketEvent.BUY);
      removeEvent(ESocketEvent.SELL);
    };
  }, [isConnected]);

  return (
    <div>
      <div className="w-full flex sm:flex-row flex-col sm:items-center justify-between">
        <TabTitle title="Coin created" />
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
      ) : !coinCreated?.length && !isPending ? (
        <NoData />
      ) : (
        <div>
          <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 my-9">
            {coinCreated?.map(
              (project: IProjectCardResponse, index: number) => (
                <ProjectCard data={project} key={index} />
              )
            )}
          </div>
          <AppDivider />
          <AppPaginationCustom
            label="tokens"
            total={total}
            page={params?.page}
            limit={params?.limit}
            onChange={(page) => setParams({ ...params, page })}
            hideOnSinglePage={true}
          />
          {/* <AppPagination
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

export default CoinCreatedTab;
