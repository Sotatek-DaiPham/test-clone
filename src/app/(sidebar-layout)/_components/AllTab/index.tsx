import AppPaginationCustom from "@/components/app-pagination/app-pagination-custom";
import NoData from "@/components/no-data";
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
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import { useCallback, useState } from "react";
import FilterTerminal from "../FilterTerminal";
import ProjectCard from "../ProjectCard";

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
      // {
      //   label: "Progress",
      //   value: "progress",
      // },
      {
        label: "Volume",
        value: "volume",
      },
      {
        label: "Txns",
        value: "txns",
      },
    ],
  },
  {
    label: "Rising",
    value: "rasing",
    icon: DollarCircleUpIcon,
    // children: [
    //   {
    //     label: "5M",
    //     value: "5m",
    //   },
    //   {
    //     label: "1H",
    //     value: "1h",
    //   },
    //   {
    //     label: "6H",
    //     value: "6h",
    //   },
    //   {
    //     label: "24H",
    //     value: "24h",
    //   },
    // ],
  },
  {
    label: "New",
    value: "new",
    icon: NewSpaperIcon,
  },
  {
    label: "Finalized",
    value: "finalize",
    icon: FinalizedIcon,
    // children: [
    //   {
    //     label: "Trending",
    //     value: "treding",
    //   },
    //   {
    //     label: "Newest",
    //     value: "newest",
    //   },
    //   {
    //     label: "Top Mcap",
    //     value: "top-mcap",
    //   },
    //   {
    //     label: "Oldest",
    //     value: "oldest",
    //   },
    // ],
  },
  {
    label: "Age",
    value: "age",
    icon: UsersIcon,
    children: [
      { key: "", label: "Any" },
      { key: "less15m", label: "≤15m" },
      { key: "less30m", label: "≤30m" },
      { key: "less1h", label: "≤1h" },
      { key: "less3h", label: "≤3h" },
      { key: "less6h", label: "≤6h" },
      { key: "less12h", label: "≤12h" },
      { key: "less124h", label: "≤24h" },
      { key: "less3d", label: "≤3d" },
    ],
    children1: [
      { key: "bigger15m", label: "≥15m" },
      { key: "bigger30m", label: "≥30m" },
      { key: "bigger1h", label: "≥1h" },
      { key: "bigger3h", label: "≥3h" },
      { key: "bigger6h", label: "≥6h" },
      { key: "bigger12h", label: "≥12h" },
      { key: "bigger25h", label: "≥24h" },
      { key: "bigger3d", label: "≥3d" },
    ],
  },
  {
    label: "Min progress",
    value: "minProgress",
    icon: DropdownIcon,
    children: [
      { key: "", label: "Any" },
      { key: "10", label: "10%" },
      { key: "25", label: "25%" },
      { key: "50", label: "50%" },
      { key: "75", label: "75%" },
      { key: "90", label: "90%" },
    ],
  },
  {
    label: "Max progress",
    value: "maxProgress",
    icon: DropdownIcon,
    children: [
      { key: "", label: "Any" },
      { key: "10", label: "10%" },
      { key: "25", label: "25%" },
      { key: "50", label: "50%" },
      { key: "75", label: "75%" },
      { key: "90", label: "90%" },
    ],
  },
];

const AllTab = () => {
  const [search, setSearch] = useState<string>("");
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");

  const [params, setParams] = useState<any>({
    page: 1,
    limit: 100,
  });

  const debounceSearch = useDebounce(search);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [
      "all-tab",
      params,
      debounceSearch,
      searchParams.filter,
      searchParams.top,
      searchParams.age,
      searchParams.minProgress,
      searchParams.maxProgress,
    ],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.LIST, {
        params: {
          ...params,
          keyword: debounceSearch,
          age: searchParams?.age,
          minProgress: searchParams?.minProgress,
          maxProgress: searchParams?.maxProgress,
          mainFilterToken:
            searchParams?.filter === "top" && searchParams?.top === "volume"
              ? "TOP_VOLUME"
              : searchParams.top === "txns"
              ? "TOP_TRANSACTION"
              : searchParams.filter?.toUpperCase() || "TRENDING",
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<ITokenDashboardResponse[]>, any>
      >;
    },
    enabled: !searchParams.tab ? true : searchParams.tab === "all",
  });

  const tokenList = get(data, "data.data", []) as ITokenDashboardResponse[];

  const total = get(data, "data.metadata.total", 0) as number;

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
        handleClickFilterOption={handleClickFilterOption}
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

export default AllTab;
