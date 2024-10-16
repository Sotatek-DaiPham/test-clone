import ProjectCard from "@/app/(sidebar-layout)/_components/ProjectCard";
import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { PortfolioResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { formatAmount, nFormatter } from "@/helpers/formatNumber";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { HideDustCoinIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useState } from "react";
import TabTitle from "../../TabTitle";

const PortfolioTab = ({ walletAddress }: { walletAddress: string }) => {
  const [hideDustCoin, setHideDustCoin] = useState<boolean>(false);
  const { searchParams } = useAppSearchParams("myProfile");
  const [params, setParams] = useState<any>({
    search: "",
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });

  const debounceSearch = useDebounce(params?.search);

  const { data, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.PORTFOLIO, {
        params: {
          limit: params.limit,
          pageNumber: params.page,
          walletAddress: walletAddress,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<PortfolioResponse[]>, any>>;
    },
    enabled: searchParams.tab === "portfolio",
  });

  const myPortfolio = get(data, "data.data", []) as PortfolioResponse[];
  const total = get(data, "data.metadata.total", 0) as number;

  console.log("data", myPortfolio);
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Portfolio" />
        <div className="flex flex-row items-center">
          <AppButton
            size="small"
            typeButton="outline"
            rootClassName="!w-fit"
            classChildren={`!flex !flex-row !items-center ${
              hideDustCoin ? "!text-primary-main" : ""
            }`}
            onClick={() => setHideDustCoin(!hideDustCoin)}
          >
            <Image
              src={HideDustCoinIcon}
              alt="hide-coin"
              className={`${hideDustCoin ? "active-primary-icon" : ""}`}
            />
            <span className="ml-2">Hide dust coin</span>
          </AppButton>
          <AppInput
            className="!w-[400px]"
            isSearch={true}
            iconPosition="left"
            placeholder="Search"
            value={params?.search}
            onChange={(e) => setParams({ ...params, search: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 my-9">
        {myPortfolio?.map((project: any, index: number) => (
          <ProjectCard
            className="pb-4"
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
            footer={
              <div className="mt-3 text-14px-normal text-neutral-7">
                <div className="mt-2 flex justify-between">
                  <span>Total hold</span>
                  <span>
                    <span className="text-primary-main mr-2">
                      {formatAmount(project?.amount || 0)}
                    </span>
                    <span className="text-white-neutral capitalize">
                      {project?.title || "-"}
                    </span>
                  </span>
                </div>
                <div className="my-2 flex justify-between">
                  <span>Value</span>
                  <span>
                    <span className="text-primary-main mr-2">
                      {nFormatter("12")}
                    </span>
                    <span className="text-white-neutral uppercase">USDT</span>
                  </span>
                </div>
              </div>
            }
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

export default PortfolioTab;
