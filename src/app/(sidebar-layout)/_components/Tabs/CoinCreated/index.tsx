import ProjectCard from "@/app/(sidebar-layout)/_components/ProjectCard";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import { useState } from "react";
import TabTitle from "../../TabTitle";

const CoinCreatedTab = ({ walletAddress }: { walletAddress: string }) => {
  const { searchParams } = useAppSearchParams("myProfile");
  const [params, setParams] = useState<any>({
    search: "",
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const debounceSearch = useDebounce(params?.search);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["coin-created"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.COINS_CREATED, {
        params: {
          limit: params.limit,
          pageNumber: params.page,
          walletAddress: walletAddress,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse>, any>>;
    },
    enabled: searchParams.tab === "coin-created",
  });

  const coinCreated = get(data, "data.data", []) as MyProfileResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Coin created" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={params?.search}
          onChange={(e) => setParams({ ...params, search: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-3 gap-6 my-9">
        {coinCreated?.map((project: any, index: number) => (
          <ProjectCard
            data={{
              address: project?.contract_address,
              title: project?.title,
              total: project?.total_supply,
              description: project?.description,
              currentValue: project?.amount,
              percent:
                (Number(project?.amount) / Number(project?.total_supply)) * 100,
              stage:
                Number(project?.total_supply) === Number(project?.amount)
                  ? "Listed"
                  : "",
            }}
            key={index}
          />
        ))}
      </div>
      <AppDivider />
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
      />
    </div>
  );
};

export default CoinCreatedTab;
