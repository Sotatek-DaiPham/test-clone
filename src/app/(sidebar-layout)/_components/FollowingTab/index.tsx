import AppPaginationCustom from "@/components/app-pagination/app-pagination-custom";
import NoData from "@/components/no-data";
import { API_PATH } from "@/constant/api-path";
import { ITokenDashboardResponse } from "@/entities/dashboard";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { DollarCircleUpIcon, TrendUpIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useCallback, useState } from "react";
import FilterTerminal from "../FilterTerminal";
import ProjectCard from "../ProjectCard";

const FILTER_TERMINAL = [
  {
    label: "Activity",
    value: "activity",
    icon: TrendUpIcon,
  },
  {
    label: "Created coins",
    value: "created",
    icon: DollarCircleUpIcon,
  },
];

const FollowingTab = () => {
  const [search, setSearch] = useState<string>("");
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");

  const [params, setParams] = useState<any>({
    page: 1,
    limit: 100,
  });

  const debounceSearch = useDebounce(search);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["all-following", params, debounceSearch],
    queryFn: async () => {
      return getAPI(
        searchParams?.filter === "created"
          ? API_PATH.TOKEN.FOLLOWING_TOKEN_CREATED
          : API_PATH.TRADING.ACTIVITY,
        {
          params: {
            ...params,
            keyword: debounceSearch,
          },
        }
      ) as Promise<
        AxiosResponse<BeSuccessResponse<ITokenDashboardResponse[]>, any>
      >;
    },
  });

  const tokenList = get(data, "data.data", []) as ITokenDashboardResponse[];

  const total = get(data, "data.metadata.total", 0) as number;

  const handleClickFilter = useCallback(
    (value: any, queryKey: string) => {
      setSearchParams({
        ...searchParams,
        [queryKey]: value,
      });
      refetch();
    },
    [searchParams, setSearchParams]
  );

  return (
    <div>
      {isPending && <Spin />}
      <FilterTerminal
        search={search}
        onChangeSearch={(e) => {
          setSearch(e);
          setParams({ ...params, page: 1 });
        }}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
        handleClickFilterOption={handleClickFilter}
      />
      {!tokenList?.length && !isPending ? (
        <NoData></NoData>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-6 my-9">
            {tokenList?.map(
              (project: ITokenDashboardResponse, index: number) => (
                <ProjectCard data={project} key={index} />
              )
            )}
          </div>
          <AppPaginationCustom
            label="tokens"
            total={total}
            page={params?.page}
            limit={params?.limit}
            onChange={(page) => setParams({ ...params, page })}
            hideOnSinglePage={true}
          />
          {/* {baseData?.length < total && (
            <div className="w-full flex justify-center mt-2">
              <AppButton
                customClass="!w-[200px]"
                loading={isPending}
                onClick={() => setParams({ ...params, page: params.page + 1 })}
              >
                Load more
              </AppButton>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default FollowingTab;
