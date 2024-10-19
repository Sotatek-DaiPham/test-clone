import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import NoData from "@/components/no-data";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { IMyRepliesResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { ArrowExport } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useState } from "react";
import TabTitle from "../../TabTitle";

const ReplyItem = ({ data }: { data: IMyRepliesResponse }) => {
  return (
    <div className="flex flex-col w-full bg-neutral-2 rounded-3xl px-6 py-4 text-neutral-9">
      <div className="flex flex-row gap-3">
        <div className="w-[40px] h-[40px] rounded-full bg-primary-7"></div>
        <div className="flex flex-col">
          <div className="text-16px-bold">{data?.userName}</div>
          <span className="text-14px-normal text-neutral-7">
            {data?.tokenId}
            <span className="ml-10">{data?.createdAt}</span>
          </span>
        </div>
      </div>
      <div className="my-4 truncate-2-line text-14px-normal">
        {data?.content}
      </div>
      <AppButton
        size="small"
        typeButton="outline-primary"
        customClass="!w-fit !rounded-full"
        classChildren="!flex !flex-row !items-center !text-primary-main"
      >
        <span className="mr-2">View in thread</span>
        <Image
          src={ArrowExport}
          alt="arrow-export"
          className="active-primary-icon"
        />
      </AppButton>
    </div>
  );
};

const MyRepliesTab = () => {
  const { searchParams, setSearchParams } = useAppSearchParams("myProfile");
  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const [search, setSearch] = useState<string>("");

  const debounceSearch = useDebounce(search, () =>
    setParams({ ...params, page: 1 })
  );

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["my-replies", params, debounceSearch, searchParams],
    queryFn: async () => {
      return getAPI(API_PATH.USER.MY_REPLIES, {
        params: {
          ...params,
          keyword: debounceSearch,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<IMyRepliesResponse[]>, any>
      >;
    },
    enabled: searchParams.tab === "my-replies",
  });

  const myReplies = get(data, "data.data", []) as IMyRepliesResponse[];

  const total = get(data, "data.metadata.total", 0) as number;

  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="My replies" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {!myReplies?.length && !isPending ? (
        <NoData />
      ) : (
        <div>
          <div className="my-6 grid grid-cols-2 gap-6">
            {myReplies?.map((item: IMyRepliesResponse, index: number) => (
              <ReplyItem data={item} key={index} />
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
            onChange={(page: any, size) =>
              setParams((prev: any) => ({ ...prev, page, limit: size }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default MyRepliesTab;
