"use client";
import AppInput from "@/components/app-input";
import AppPagination from "@/components/app-pagination";
import AppTable from "@/components/app-table";
import ShowingPage from "@/components/showing-page";
import { LIMIT_ITEMS_TABLE } from "@/constant";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";
import "./styles.scss";
import { shortenAddress } from "@/helpers/shorten";
import EllipsisTextWithTooltip from "@/components/app-tooltip/EllipsisTextWithTooltip";
import AppTooltip from "@/components/app-tooltip";
import AppImage from "@/components/app-image";
import { formatAmount } from "@/helpers/formatNumber";
import { TopLeaderBoardIcon } from "@public/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PATH_ROUTER } from "@/constant/router";

const data = [
  {
    rank: 1,
    username: "dovansy",
    address: "0x16A18C10301132505B2a7469b8857B97B155C86A",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
  {
    rank: 2,
    username: "dovansy",
    address: "0xD788549eCae5b2198822D71dA71491e6eb7c5dB7",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
  {
    rank: 3,
    username: "dovansy",
    address: "0x840bA201AdBee4563AE5Bc7546D13e9582EB2D79",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
  {
    rank: 4,
    username: "dovansy",
    address: "0x93BF33175F47a863e5c05ef132d9F609A91C91C5",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
  {
    rank: 5,
    username: "dovansy",
    address: "0x93BF33175F47a863e5c05ef132d9F609A91C91C5",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
  {
    rank: 6,
    username: "dovansy",
    address: "0x93BF33175F47a863e5c05ef132d9F609A91C91C5",
    pal: 3000,
    total: 10000,
    buy: 1200,
    sell: 5000,
  },
];
const LeaderboardPage = () => {
  const router = useRouter();
  const [params, setParams] = useState<any>({
    page: 1,
    limit: LIMIT_ITEMS_TABLE,
  });
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: "10%",
      render: (value: string, data: any) => {
        return (
          <div className="relative h-fit w-fit">
            <Image src={TopLeaderBoardIcon} alt="top-leaderboard" />
            <span className="text-primary-main text-22px-bold absolute inset-0 flex items-center justify-center">
              {value}
            </span>
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      width: "50px",
      render: (value: string, data: any) => {
        return (
          <div
            className="flex flex-row items-center w-fit cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(PATH_ROUTER.USER_PROFILE(data?.address));
            }}
          >
            <AppImage
              src={data?.avatar}
              alt="avatar"
              className="w-[40px] h-[40px] rounded-full bg-primary-7 mr-3"
            />
            <span>{value}</span>
          </div>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "15%",
      render: (value: string) => {
        return <AppTooltip title={value}>{shortenAddress(value)}</AppTooltip>;
      },
    },
    {
      title: "Profit and loss",
      dataIndex: "pal",
      key: "pal",
      sorter: true,
      width: "15%",
      render: (value: string, data: any) => {
        return <span>{formatAmount(value)}</span>;
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "15%",
      render: (value: string, data: any) => {
        return <span>{formatAmount(value)}</span>;
      },
    },
    {
      title: "Buy",
      dataIndex: "buy",
      key: "buy",
      width: "15%",
      render: (value: string, data: any) => {
        return <span className="text-success-main">{formatAmount(value)}</span>;
      },
    },
    {
      title: "Sell",
      dataIndex: "sell",
      key: "sell",
      width: "15%",
      render: (value: string, data: any) => {
        return <span className="text-error-main">{formatAmount(value)}</span>;
      },
    },
  ];

  return (
    <div className="m-auto max-w-[var(--width-content-sidebar-layout)]">
      <div></div>
      <div className="w-full flex justify-end">
        <AppInput
          className="!w-[400px]"
          isSearch={true}
          iconPosition="left"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="my-6">
        <AppTable
          className="leaderboard-app-table"
          loading={false}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="rank"
        />
      </div>
      <AppPagination
        className="w-full !justify-end !mr-6"
        hideOnSinglePage={true}
        showTotal={(total, range) => (
          <ShowingPage total={total} range={range} />
        )}
        current={params?.page}
        pageSize={params?.limit}
        total={18}
        onChange={(page, size) => {
          setParams((prev: any) => ({ ...prev, page, limit: size }));
        }}
      />
    </div>
  );
};

export default LeaderboardPage;
