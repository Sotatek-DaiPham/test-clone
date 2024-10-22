import AppButton from "@/components/app-button";
import NoData from "@/components/no-data";
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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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
    value: "rising",
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
    value: "finalized",
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
      { key: "", label: "any" },
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

  const [baseData, setBaseData] = useState<ITokenDashboardResponse[]>([]);

  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });

  const debounceSearch = useDebounce(search);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["all-tab", params, debounceSearch],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.LIST, {
        params: {
          ...params,
          keyword: debounceSearch,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<ITokenDashboardResponse[]>, any>
      >;
    },
    enabled: !searchParams.tab ? true : searchParams.tab === "all",
  });

  const tokenList = useMemo(() => {
    return get(data, "data.data", []) as ITokenDashboardResponse[];
  }, [data]);

  const total = get(data, "data.metadata.total", 0) as number;

  useLayoutEffect(() => {
    const base = [...baseData, ...tokenList];
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
        onChangeSearch={(e) => {
          setSearch(e);
          setBaseData([]);
          setParams({ ...params, page: 1 });
        }}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
        handleClickFilterOption={handleClickFilterOption}
      />
      {!baseData?.length && !isPending ? (
        <NoData></NoData>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-6 my-9">
            {baseData?.map(
              (project: ITokenDashboardResponse, index: number) => (
                <ProjectCard data={project} key={index} />
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

export default AllTab;
