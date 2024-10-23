import AppPagination from "@/components/app-pagination";
import AppTable from "@/components/app-table";
import ShowingPage from "@/components/showing-page";
import { ETradeAction, TOKEN_DECIMAL, USDT_DECIMAL } from "@/constant";
import { API_PATH } from "@/constant/api-path";
import { envs } from "@/constant/envs";
import { useTokenDetail } from "@/context/TokenDetailContext";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import { formatRoundFloorDisplayWithCompare } from "@/helpers/formatNumber";
import { cleanParamObject } from "@/helpers/shorten";
import { IMetaData } from "@/interfaces";
import { IGetTradeHistoryParams, ITradeHistoryRes } from "@/interfaces/token";
import { getAPI } from "@/service";
import { ArrowExport } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { ColumnType } from "antd/es/table";
import BigNumber from "bignumber.js";
import { get } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const TradeHistory = () => {
  const { tokenDetail } = useTokenDetail();
  const [searchParams, setSearchParams] = useState<{
    page: number;
    action: string;
    startDate: string;
    endDate: string;
  }>({
    page: 1,
    action: "",
    startDate: "",
    endDate: "",
  });

  const { data, refetch, isFetching } = useQuery({
    queryFn: () => {
      return getAPI(API_PATH.TOKEN.TRADING_HISTORIES, {
        params: cleanParamObject({
          page: searchParams.page,
          limit: 100,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          tokenAddress: tokenDetail?.contractAddress,
        } as IGetTradeHistoryParams),
      });
    },
    select(data) {
      return data;
    },
    queryKey: [API_PATH.TOKEN.TRADING_HISTORIES, searchParams],
  });

  const metadata = get(data, "data.metadata") as IMetaData;

  const listData = get(data, "data.data", []) as ITradeHistoryRes[];

  const columns: ColumnType<any>[] = [
    {
      title: "Type",
      dataIndex: "action",
      key: "action",
      render(value, record, index) {
        return value === ETradeAction.BUY ? (
          <div className="rounded-2xl bg-[rgba(15,190,90,0.2)] px-3 text-[#0FBE5A] text-16px-normal w-fit">
            Buy
          </div>
        ) : (
          <div className="rounded-2xl bg-[rgba(235,81,70,0.20)] px-3 text-error-main text-16px-normal w-fit">
            Sell
          </div>
        );
      },
    },
    {
      title: "USDT",
      dataIndex: "usdt_amount",
      key: "usdt_amount",
      render(value, record, index) {
        const usdtAmount = BigNumber(value).div(USDT_DECIMAL);
        return (
          <div>{formatRoundFloorDisplayWithCompare(usdtAmount) || ""}</div>
        );
      },
    },
    {
      title: tokenDetail?.symbol,
      dataIndex: "amount",
      key: "amount",
      render(value, record, index) {
        const tokenAmount = BigNumber(value).div(TOKEN_DECIMAL);
        return (
          <div>{formatRoundFloorDisplayWithCompare(tokenAmount) || ""}</div>
        );
      },
    },
    {
      title: "DATE AND TIME",
      dataIndex: "created_at",
      key: "created_at",
      render(value, record, index) {
        return <div>{getTimeDDMMMYYYYHHMM(value)}</div>;
      },
    },
    {
      title: "MAKER",
      dataIndex: "username",
      key: "username",
      render(value, record, index) {
        return (
          <div className="text-[#0184FC] px-3 text-16px-normal rounded-xl bg-[rgba(1,132,252,0.20)] w-fit">
            {value}
          </div>
        );
      },
    },
    {
      title: "TXN",
      dataIndex: "user_address",
      key: "user_address",
      render(value, record, index) {
        return (
          <Link
            href={`${envs.SCAN_URL}/address/${tokenDetail?.contractAddress}`}
            target="_blank"
            className="text-16px-medium text-white-neutral flex gap-1"
          >
            <Image src={ArrowExport} alt="arrow-export" />
          </Link>
        );
      },
    },
  ];
  return (
    <div>
      <AppTable
        scroll={{ x: 900 }}
        columns={columns}
        dataSource={listData}
        loading={isFetching}
        pagination={false}
      />
      <AppPagination
        className="w-full !justify-end !mr-6"
        hideOnSinglePage={true}
        showTotal={(total, range) => (
          <ShowingPage total={total} range={range} />
        )}
        current={searchParams?.page}
        pageSize={100}
        total={metadata?.total}
        onChange={(page, size) => {
          setSearchParams((prev: any) => ({ ...prev, page }));
        }}
      />
    </div>
  );
};

export default TradeHistory;
