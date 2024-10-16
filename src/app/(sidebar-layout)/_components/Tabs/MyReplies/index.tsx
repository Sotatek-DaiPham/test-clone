import AppButton from "@/components/app-button";
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
import { ArrowExport } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useState } from "react";
import TabTitle from "../../TabTitle";
import NoData from "@/components/no-data";
const data1 = [
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    name: "Jenny Wilson",
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
];

const ReplyItem = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col w-full bg-neutral-2 rounded-3xl px-6 py-4 text-neutral-9">
      <div className="flex flex-row gap-3">
        <div className="w-[40px] h-[40px] rounded-full bg-primary-7"></div>
        <div className="flex flex-col">
          <div className="text-16px-bold">{data?.name}</div>
          <span className="text-14px-normal text-neutral-7">
            {data?.id}
            <span className="ml-10">{data?.time}</span>
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
  const [params, setParams] = useState<any>({
    search: "",
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const debounceSearch = useDebounce(params?.search);
  const { searchParams } = useAppSearchParams("myProfile");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-replies"],
    queryFn: async () => {
      return getAPI(API_PATH.USER.MY_REPLIES, {
        params: {
          limit: params.limit,
          pageNumber: params.page,
          userId: "",
        },
      }) as Promise<AxiosResponse<BeSuccessResponse<MyProfileResponse[]>, any>>;
    },
    enabled: searchParams.tab === "my-replies",
  });

  const myReplies = get(data, "data.data", []) as MyProfileResponse[];
  const total = get(data, "data.metadata.total", 0) as number;
  console.log("data", myReplies);
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <TabTitle title="My replies" />
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={params?.search}
          onChange={(e) => setParams({ ...params, search: e.target.value })}
        />
      </div>
      {!myReplies?.length ? (
        <NoData />
      ) : (
        <div>
          <div className="my-6 grid grid-cols-2 gap-6">
            {myReplies?.map((item: any, index: number) => (
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
            onChange={(page, size) =>
              setParams((prev: any) => ({ ...prev, page, limit: size }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default MyRepliesTab;
