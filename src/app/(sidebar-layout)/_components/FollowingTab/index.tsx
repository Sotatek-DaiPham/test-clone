import AppPaginationCustom from "@/components/app-pagination/app-pagination-custom";
import EllipsisTextWithTooltip from "@/components/app-tooltip/EllipsisTextWithTooltip";
import NoData from "@/components/no-data";
import { API_PATH } from "@/constant/api-path";
import { PATH_ROUTER } from "@/constant/router";
import { ITokenDashboardResponse } from "@/entities/dashboard";
import { convertNumber, formatAmount } from "@/helpers/formatNumber";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { DollarCircleUpIcon, TrendUpIcon } from "@public/assets";
import { Spin } from "antd";
import get from "lodash/get";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const router = useRouter();
  const [data, setData] = useState<ITokenDashboardResponse[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [params, setParams] = useState<any>({
    page: 1,
    limit: 100,
  });

  const debounceSearch = useDebounce(search);

  const fetchActivityTab = async () => {
    setIsPending(true);
    const response = await getAPI(API_PATH.TRADING.ACTIVITY, {
      params: {
        ...params,
        keyword: debounceSearch?.trim(),
      },
    }).then((data) => {
      setIsPending(false);
      return data;
    });
    const tokenList = get(
      response,
      "data.data",
      []
    ) as ITokenDashboardResponse[];
    setData(tokenList);
  };

  const fetchCreatedTab = async () => {
    setIsPending(true);
    const response = await getAPI(API_PATH.TOKEN.FOLLOWING_TOKEN_CREATED, {
      params: {
        ...params,
        keyword: debounceSearch?.trim(),
      },
    }).then((data) => {
      setIsPending(false);
      return data;
    });
    const tokenList = get(
      response,
      "data.data",
      []
    ) as ITokenDashboardResponse[];
    setData(tokenList);
  };
  useEffect(() => {
    if (searchParams?.filter === "created") {
      fetchCreatedTab();
    }
    if (searchParams?.filter === "activity") {
      fetchActivityTab();
    }
  }, [searchParams?.filter, debounceSearch, params]);

  const total = get(data, "data.metadata.total", 0) as number;

  const handleClickFilter = useCallback(
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
          setParams({ ...params, page: 1 });
        }}
        filterArr={FILTER_TERMINAL}
        searchParams={searchParams}
        handleClickFilter={handleClickFilter}
        handleClickFilterOption={handleClickFilter}
      />
      {isPending ? (
        <Spin />
      ) : !data?.length && !isPending ? (
        <NoData></NoData>
      ) : (
        <div>
          <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 my-9">
            {data?.map((project: any, index: number) => (
              <ProjectCard
                data={project}
                key={index}
                header={
                  searchParams?.filter === "created" ? null : (
                    <div className="mb-3">
                      <EllipsisTextWithTooltip
                        className="mr-2 cursor-pointer text-neutral-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            PATH_ROUTER.USER_PROFILE(project?.wallet_address)
                          );
                        }}
                        value={project?.username}
                        maxWidth={100}
                      />
                      <span
                        className={
                          project?.action === "BUY"
                            ? "text-success-main"
                            : project?.action === "SELL"
                            ? "text-error-main"
                            : ""
                        }
                      >
                        {project?.action || "-"}
                      </span>
                      <span className="mx-1 ml-2">
                        {formatAmount(
                          convertNumber(project?.amount, project?.decimal)
                        ) || "-"}
                        &nbsp;
                        {project?.symbol}
                      </span>
                      <span className="text-14px-normal">for</span>
                      <span className="mx-1 ml-2">
                        {formatAmount(convertNumber(project?.usdt_amount, 6)) ||
                          "-"}
                        &nbsp;USDT
                      </span>
                    </div>
                  )
                }
              />
            ))}
          </div>
          <AppPaginationCustom
            label="tokens"
            total={total}
            page={params?.page}
            limit={params?.limit}
            onChange={(page) => setParams({ ...params, page })}
            hideOnSinglePage={true}
          />
        </div>
      )}
    </div>
  );
};

export default FollowingTab;
