import ProjectCard from "@/app/(sidebar-layout)/_components/ProjectCard";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import { API_PATH } from "@/constant/api-path";
import { MyProfileResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
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
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const { searchParams } = useAppSearchParams("myProfile");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.PORTFOLIO, {
        params: {
          limit: 10,
          pageNumber: 1,
          walletAddress: walletAddress,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "portfolio",
  });

  const myPortfolio = get(data, "data.data", []) as MyProfileResponse[];

  console.log("data", myPortfolio);
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="Portfolio" />
        <div>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 my-9">
        {myPortfolio?.map((project: any, index: number) => (
          <ProjectCard data={project} key={index} />
        ))}
      </div>
    </div>
  );
};

export default PortfolioTab;
