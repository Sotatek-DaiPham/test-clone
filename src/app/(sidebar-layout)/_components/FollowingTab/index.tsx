import AppButton from "@/components/app-button";
import NoData from "@/components/no-data";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { ITokenDashboardResponse } from "@/entities/dashboard";
import { BeSuccessResponse } from "@/entities/response";
import { convertNumber } from "@/helpers/formatNumber";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { DollarCircleUpIcon, TrendUpIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useCallback, useEffect, useState } from "react";
import FilterTerminal from "../FilterTerminal";
import ProjectCard from "../ProjectCard";

const data = [
  {
    title: "Project name",
    percent: 70,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 500000,
    currentValue: 200000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 5900000,
    currentValue: 2123000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 70,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 500000,
    currentValue: 200000,
    stage: "S1",
  },
  {
    title: "Project name",
    percent: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
    total: 5900000,
    currentValue: 2123000,
    stage: "S1",
  },
];

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
  const [baseData, setBaseData] = useState<ITokenDashboardResponse[]>([]);

  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
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

  useEffect(() => {
    const base = [...baseData, ...tokenList];
    setBaseData(base);
  }, [tokenList]);

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
      <FilterTerminal
        search={search}
        onChangeSearch={(e) => {
          setSearch(e);
          setBaseData([]);
          setParams({ ...params, page: 1 });
        }}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
        handleClickFilterOption={handleClickFilter}
      />
      {!baseData?.length && !isPending ? (
        <NoData></NoData>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-6 my-9">
            {baseData?.map(
              (project: ITokenDashboardResponse, index: number) => (
                <ProjectCard
                  data={{
                    id: project?.id,
                    logo: project?.avatar,
                    title: project?.name,
                    address: project?.contractAddress,
                    total: convertNumber(
                      project?.total_supply,
                      project?.decimal
                    ),
                    description: project?.description,
                    currentValue: convertNumber(
                      project?.initUsdtReserve,
                      project?.decimal
                    ),
                    percent:
                      (Number(
                        convertNumber(
                          project?.initUsdtReserve,
                          project?.decimal
                        )
                      ) /
                        Number(
                          convertNumber(project?.total_supply, project?.decimal)
                        )) *
                      100,
                    stage:
                      Number(project?.total_supply) ===
                      Number(project?.initUsdtReserve)
                        ? "Listed"
                        : "",
                  }}
                  key={index}
                />
              )
            )}
          </div>
          {baseData?.length < total && (
            <div className="w-full flex justify-center mt-2">
              <AppButton
                customClass="!w-[200px]"
                loading={isPending}
                onClick={() => setParams({ ...params, page: params.page + 1 })}
              >
                Load more
              </AppButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowingTab;
