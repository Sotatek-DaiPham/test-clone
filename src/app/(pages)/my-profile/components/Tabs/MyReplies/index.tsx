import React from "react";
import TabTitle from "../../TabTitle";
import AppButton from "@/components/app-button";
import AppPagination from "@/components/app-pagination";
const data = [
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
  {
    time: "24/04/2014 20:00",
    id: "#11625369",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fugit omnis et officia, vel reiciendis impedit ipsam ullam explicabo maiores accusamus alias esse totam dolorum, quos voluptatibus cupiditate quae corrupti?",
  },
];

const ReplyItem = ({ data }: { data: any }) => {
  return (
    <div className="text-[#777E90] mb-6">
      <div className="rounded-full flex flex-row items-center">
        <span className="text-14px-normal w-[15%]">{data?.time}</span>
        <span className="text-14px-normal w-[10%]">{data?.id}</span>
        <AppButton
          size="small"
          typeButton="primary"
          customClass="!w-fit !rounded-full"
          classChildren="text-black"
        >
          View in thread
        </AppButton>
      </div>
      <div className="my-3 truncate-2-line text-16px-normal">
        {data?.content}
      </div>
    </div>
  );
};

const MyRepliesTab = () => {
  return (
    <div>
      <TabTitle title="My replies" />
      <div className="my-6 w-[70%]">
        {data?.map((item: any, index: number) => (
          <ReplyItem data={item} key={index} />
        ))}
      </div>
      <AppPagination />
    </div>
  );
};

export default MyRepliesTab;
