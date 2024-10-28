import AppButton from "@/components/app-button";
import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import AppInput from "@/components/app-input";
import AppPaginationCustom from "@/components/app-pagination/app-pagination-custom";
import NoData from "@/components/no-data";
import { EDirection, LIMIT_ITEMS_TABLE } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { IMyRepliesResponse } from "@/entities/my-profile";
import { BeSuccessResponse } from "@/entities/response";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useDebounce from "@/hooks/useDebounce";
import { getAPI } from "@/service";
import { ArrowExport, ImageDefaultIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TabTitle from "../../TabTitle";
import { PATH_ROUTER } from "@/constant/router";

const ReplyItem = ({ data }: { data: IMyRepliesResponse }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full bg-neutral-2 rounded-3xl px-6 py-4 text-neutral-9">
      <div className="flex flex-row gap-3">
        <div className="!min-w-[40px] !w-[40px] !h-[40px] overflow-hidden flex items-center justify-center rounded-full bg-primary-7">
          {data?.avatar ? (
            <AppImage
              className="!bg-neutral-4 [&>img]:!object-cover"
              src={data?.avatar}
              alt="logo"
            />
          ) : (
            <Image
              className="!bg-neutral-4 [&>img]:!object-cover"
              alt="logo"
              src={ImageDefaultIcon}
            />
          )}
        </div>
        <div className="flex w-full flex-col">
          <div className="text-16px-bold truncate-1-line">{data?.userName}</div>
          <span className="text-14px-normal text-neutral-7">
            {getTimeDDMMMYYYYHHMM(data?.createdAt)}
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
        onClick={() => {
          router.push(PATH_ROUTER.TOKEN_DETAIL(data?.tokenId), {
            scroll: true,
          });
        }}
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
          orderBy: "createdAt",
          direction: EDirection.DESC,
          keyword: debounceSearch?.trim(),
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
      <div className="w-full flex sm:flex-row flex-col sm:items-center justify-between">
        <TabTitle title="My replies" />
        <AppInput
          className="sm:!w-[400px] w-full h-[40px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isPending ? (
        <Spin />
      ) : !myReplies?.length && !isPending ? (
        <NoData />
      ) : (
        <div>
          <div className="my-6 grid sm:grid-cols-2 grid-cols-1 gap-6">
            {myReplies?.map((item: IMyRepliesResponse, index: number) => (
              <ReplyItem data={item} key={index} />
            ))}
          </div>
          <AppDivider />
          <AppPaginationCustom
            label="my replies"
            total={total}
            page={params?.page}
            limit={params?.limit}
            onChange={(page) => setParams({ ...params, page })}
            hideOnSinglePage={true}
          />
          {/* <AppPagination
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
          /> */}
        </div>
      )}
    </div>
  );
};

export default MyRepliesTab;
