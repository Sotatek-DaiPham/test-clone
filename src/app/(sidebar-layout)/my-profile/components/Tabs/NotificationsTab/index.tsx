import AppDivider from "@/components/app-divider";
import TabTitle from "../../TabTitle";
import AppPagination from "@/components/app-pagination";

const data = [
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Bought",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
  {
    time: "14/04/2014 20:00",
    type: "Sold",
    address: "ABC...XYZ",
    balance: 123456,
    coin: "POG",
  },
];
const NotificationItem = ({ data }: { data: any }) => {
  return (
    <div>
      <div className="text-18px-medium text-white-neutral">{data?.time}</div>
      <div className="text-18px-medium text-white-neutral flex flex-row gap-2 my-6">
        <span>{data?.address}</span>
        <span
          className={
            data?.type === "Bought" ? "text-[#64e06c]" : "text-[#da302c]"
          }
        >
          {data?.type}
        </span>
        <span>{data?.balance} of</span>
        <span className="text-[#FFFF53]">{data?.coin}</span>
      </div>
      <AppDivider />
    </div>
  );
};
const NotificationsTab = () => {
  return (
    <div>
      <TabTitle title="Notifications" />
      <div className="my-6 w-[70%]">
        {data?.map((item: any, index: number) => (
          <NotificationItem data={item} key={index} />
        ))}
      </div>
      <AppPagination />
    </div>
  );
};

export default NotificationsTab;
