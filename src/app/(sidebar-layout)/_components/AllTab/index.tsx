import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { ITokenDashboardResponse } from "@/entities/dashboard";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import {
  DollarCircleUpIcon,
  DropdownIcon,
  FinalizedIcon,
  NewSpaperIcon,
  TopIcon,
  TrendUpIcon,
  UsersIcon,
} from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterTerminal from "../FilterTerminal";
import ProjectCard from "../ProjectCard";
import { convertNumber } from "@/helpers/formatNumber";
import AppButton from "@/components/app-button";
import NoData from "@/components/no-data";

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
    label: "Trending",
    value: "trending",
    icon: TrendUpIcon,
  },
  {
    label: "Top",
    value: "top",
    icon: TopIcon,
    children: [
      {
        label: "Progress",
        value: "progress",
      },
      {
        label: "Volumn",
        value: "volumn",
      },
      {
        label: "Txns",
        value: "txns",
      },
    ],
  },
  {
    label: "Rising",
    value: "rising",
    icon: DollarCircleUpIcon,
    children: [
      {
        label: "5M",
        value: "5m",
      },
      {
        label: "1H",
        value: "1h",
      },
      {
        label: "6H",
        value: "6h",
      },
      {
        label: "24H",
        value: "24h",
      },
    ],
  },
  {
    label: "New",
    value: "new",
    icon: NewSpaperIcon,
  },
  {
    label: "Finalized",
    value: "finalized",
    icon: FinalizedIcon,
    children: [
      {
        label: "Trending",
        value: "treding",
      },
      {
        label: "Newest",
        value: "newest",
      },
      {
        label: "Top Mcap",
        value: "top-mcap",
      },
      {
        label: "Oldest",
        value: "oldest",
      },
    ],
  },
  {
    label: "Age",
    value: "age",
    icon: UsersIcon,
  },
  {
    label: "Min progress",
    value: "min-progress",
    icon: DropdownIcon,
  },
  {
    label: "Max progress",
    value: "max-progress",
    icon: DropdownIcon,
  },
];

const AllTab = () => {
  const [search, setSearch] = useState<string>("");
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");

  const [baseData, setBaseData] = useState<ITokenDashboardResponse[]>([]);
  const debounceSearch = useDebounce(search);

  const [params, setParams] = useState<any>({
    search: "",
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });

  console.log("params", params);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-tab", params],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.LIST, {
        params: {
          limit: params.limit,
          pageNumber: params.page,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<ITokenDashboardResponse[]>, any>
      >;
    },
  });

  const tokenList = get(data, "data.data", []) as ITokenDashboardResponse[];

  const total = get(data, "data.metadata.total", 0) as number;

  console.log("tokenList", tokenList);
  console.log("total", total);

  useEffect(() => {
    const base = [...baseData, ...tokenList];
    console.log("base", base?.length);
    setBaseData(base);
  }, [tokenList]);

  const handleClickFilter = useCallback(
    (value: any, queryKey: string, subValue?: any, subQueryKey?: any) => {
      const newParams = {
        tab: searchParams.tab ?? "all",
      };
      setSearchParams({
        ...newParams,
        [queryKey]: value,
        ...(subValue &&
          subQueryKey && {
            [subQueryKey]: subValue,
          }),
      });
    },
    [searchParams, setSearchParams]
  );

  const handleClickFilterOption = useCallback(
    (value: any, queryKey: string) => {
      setSearchParams({
        ...searchParams,
        [queryKey]: value,
      });
    },
    [searchParams, setSearchParams]
  );

  return (
    <div>
      <FilterTerminal
        search={search}
        onChangeSearch={setSearch}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
        handleClickFilterOption={handleClickFilterOption}
      />
      {!baseData?.length && !isLoading ? (
        <NoData></NoData>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-6 my-9">
            {baseData?.map(
              (project: ITokenDashboardResponse, index: number) => (
                <ProjectCard
                  data={{
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
                loading={isLoading}
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

export default AllTab;
